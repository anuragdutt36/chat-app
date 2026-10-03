import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadToCloudinary } from "../config/cloudinary.js";
import { io } from "../socket/socket.js";

export const register = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;
        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "Username already exists, try a different one" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        let profilePhotoUrl = `https://api.dicebear.com/10.x/loops/svg?seed=${username}`;

        // Upload custom profile photo to Cloudinary if provided
        if (req.file) {
            try {
                const cloudRes = await uploadToCloudinary(req.file.buffer);
                if (cloudRes?.secure_url) {
                    profilePhotoUrl = cloudRes.secure_url;
                }
            } catch (uploadErr) {
                console.error("Cloudinary upload failed, falling back to avatar:", uploadErr);
            }
        }

        await User.create({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePhoto: profilePhotoUrl,
        });
        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error during registration", success: false });
    }
};
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        };
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect username or password",
                success: false
            })
        };
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect username or password",
                success: false
            })
        };
        const tokenData = {
            userId: user._id
        };

        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true }).json({
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
            profilePhoto: user.profilePhoto,
            blockedUsers: user.blockedUsers || [],
            token: token,
            message: `Welcome back ${user.fullName}`,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error during login", success: false });
    }
}
export const logout = (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0, httpOnly: true, sameSite: 'none', secure: true }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error during logout", success: false });
    }
}
export const getOtherUsers = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        return res.status(200).json(otherUsers);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error fetching users", success: false });
    }
}
export const toggleBlock = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        const targetUserId = req.params.id;

        const user = await User.findById(loggedInUserId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (!user.blockedUsers) {
            user.blockedUsers = [];
        }

        const isAlreadyBlocked = user.blockedUsers.some(
            (id) => id.toString() === targetUserId.toString()
        );

        if (isAlreadyBlocked) {
            user.blockedUsers = user.blockedUsers.filter(
                (id) => id.toString() !== targetUserId.toString()
            );
        } else {
            user.blockedUsers.push(targetUserId);
        }

        await user.save();

        return res.status(200).json({
            isBlocked: !isAlreadyBlocked,
            blockedUsers: user.blockedUsers,
            message: !isAlreadyBlocked ? "User blocked successfully." : "User unblocked successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to toggle block status." });
    }
}

export const updateProfilePhoto = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        if (!req.file) {
            return res.status(400).json({ message: "Please select an image file to upload." });
        }

        const cloudRes = await uploadToCloudinary(req.file.buffer);
        if (!cloudRes?.secure_url) {
            return res.status(500).json({ message: "Failed to upload image to Cloudinary." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            loggedInUserId,
            { profilePhoto: cloudRes.secure_url },
            { new: true }
        ).select("-password");

        // Broadcast updated profile info to connected clients
        io.emit("userUpdated", {
            userId: loggedInUserId,
            profilePhoto: cloudRes.secure_url,
        });

        return res.status(200).json({
            message: "Profile photo updated successfully!",
            user: updatedUser,
            profilePhoto: cloudRes.secure_url,
            success: true
        });
    } catch (error) {
        console.error("Error updating profile photo:", error);
        return res.status(500).json({ message: "Internal server error updating profile photo." });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        const { fullName } = req.body;

        const updateData = {};
        if (fullName && fullName.trim() !== "") {
            updateData.fullName = fullName.trim();
        }

        if (req.file) {
            const cloudRes = await uploadToCloudinary(req.file.buffer);
            if (cloudRes?.secure_url) {
                updateData.profilePhoto = cloudRes.secure_url;
            }
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No profile changes provided." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            loggedInUserId,
            updateData,
            { new: true }
        ).select("-password");

        // Broadcast updated profile info to connected clients
        io.emit("userUpdated", {
            userId: loggedInUserId,
            fullName: updatedUser.fullName,
            profilePhoto: updatedUser.profilePhoto,
        });

        return res.status(200).json({
            message: "Profile updated successfully!",
            user: updatedUser,
            success: true
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: "Internal server error updating profile." });
    }
};