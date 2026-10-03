import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;
        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password do not match" });
        }

        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "Username already exit try different" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const maleProfilePhoto = `https://api.dicebear.com/10.x/loops/svg?seed=${username}`;
        const femaleProfilePhoto = `https://api.dicebear.com/10.x/loops/svg?seed=${username}`;

        await User.create({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePhoto: gender === "male" ? maleProfilePhoto : femaleProfilePhoto,
        });
        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        })
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