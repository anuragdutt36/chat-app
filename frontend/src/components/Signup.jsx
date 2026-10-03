import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "..";
import { HiCamera, HiX } from "react-icons/hi";

const Signup = () => {
  const [user, setUser] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleCheckbox = (gender) => {
    setUser({ ...user, gender });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setProfilePhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!user.gender) {
      toast.error("Please select a gender");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Creating your account...");
    try {
      const formData = new FormData();
      formData.append("fullName", user.fullName);
      formData.append("username", user.username);
      formData.append("password", user.password);
      formData.append("confirmPassword", user.confirmPassword);
      formData.append("gender", user.gender);
      if (profilePhoto) {
        formData.append("profilePhoto", profilePhoto);
      }

      const res = await axios.post(`${BASE_URL}/api/v1/user/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed", { id: toastId });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-3 sm:px-4 py-4 sm:py-0 overflow-y-auto max-h-[95vh] custom-scrollbar">
      <div className="w-full p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl bg-slate-900/70 backdrop-blur-2xl border border-white/10 ring-1 ring-white/5">
        <div className="text-center mb-4 sm:mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
            Create Account
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Join the conversation and connect with friends
          </p>
        </div>

        {/* Profile Image Upload */}
        <div className="flex flex-col items-center mb-4">
          <div className="relative group cursor-pointer">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 rounded-full overflow-hidden border-2 border-dashed border-blue-500/60 bg-slate-800/80 flex items-center justify-center transition-all group-hover:border-blue-400 group-hover:scale-105 shadow-inner"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-slate-400 group-hover:text-blue-400 transition-colors">
                  <HiCamera size={24} />
                  <span className="text-[10px] mt-0.5 font-medium">Photo</span>
                </div>
              )}
            </div>

            {previewUrl && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
                title="Remove photo"
              >
                <HiX size={12} />
              </button>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <p className="text-[11px] text-slate-400 mt-1.5">
            {profilePhoto ? profilePhoto.name : "Optional: Upload custom profile photo"}
          </p>
        </div>

        <form onSubmit={onSubmitHandler} className="flex flex-col gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              value={user.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              className="w-full bg-slate-800/60 border border-slate-700/60 text-slate-100 placeholder-slate-400 text-sm focus:bg-slate-800 focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/40 transition-all rounded-xl py-2.5 px-4 outline-none"
              type="text"
              placeholder="e.g. John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Username
            </label>
            <input
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="w-full bg-slate-800/60 border border-slate-700/60 text-slate-100 placeholder-slate-400 text-sm focus:bg-slate-800 focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/40 transition-all rounded-xl py-2.5 px-4 outline-none"
              type="text"
              placeholder="e.g. johndoe"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full bg-slate-800/60 border border-slate-700/60 text-slate-100 placeholder-slate-400 text-sm focus:bg-slate-800 focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/40 transition-all rounded-xl py-2.5 px-4 outline-none"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Confirm Password
            </label>
            <input
              value={user.confirmPassword}
              onChange={(e) =>
                setUser({ ...user, confirmPassword: e.target.value })
              }
              className="w-full bg-slate-800/60 border border-slate-700/60 text-slate-100 placeholder-slate-400 text-sm focus:bg-slate-800 focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/40 transition-all rounded-xl py-2.5 px-4 outline-none"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Gender
            </label>
            <div className="flex items-center gap-6 py-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-sm">
                <input
                  type="radio"
                  name="gender"
                  checked={user.gender === "male"}
                  onChange={() => handleCheckbox("male")}
                  className="radio radio-primary radio-sm border-slate-600 checked:bg-blue-600"
                />
                <span>Male</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-sm">
                <input
                  type="radio"
                  name="gender"
                  checked={user.gender === "female"}
                  onChange={() => handleCheckbox("female")}
                  className="radio radio-primary radio-sm border-slate-600 checked:bg-blue-600"
                />
                <span>Female</span>
              </label>
            </div>
          </div>

          <div className="mt-2">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white rounded-xl shadow-md transition-all font-semibold text-sm"
            >
              Sign Up
            </button>
          </div>

          <p className="text-xs text-center mt-2 text-slate-400">
            Already have an account?{" "}
            <Link
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              to="/login"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;