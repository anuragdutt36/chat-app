import React, { useState, useRef } from "react";
import {
  HiOutlineX,
  HiOutlineBell,
  HiOutlineVolumeUp,
  HiOutlineMoon,
  HiOutlineSun,
  HiCamera,
} from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { updateSettings, setAuthUser } from "../redux/userSlice";
import axios from "axios";
import { BASE_URL } from "..";
import toast from "react-hot-toast";

const ToggleSwitch = ({ active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
      active ? "bg-emerald-500" : "bg-slate-600"
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
        active ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
);

const SettingsModal = ({ isOpen, onClose }) => {
  const { appSettings: rawSettings, authUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [isEditingName, setIsEditingName] = useState(false);
  const [fullNameInput, setFullNameInput] = useState(authUser?.fullName || "");
  const [savingName, setSavingName] = useState(false);

  const handleUpdateName = async () => {
    if (!fullNameInput.trim()) {
      toast.error("Full name cannot be empty");
      return;
    }
    setSavingName(true);
    const toastId = toast.loading("Updating name...");
    try {
      const res = await axios.put(
        `${BASE_URL}/api/v1/user/profile`,
        { fullName: fullNameInput.trim() },
        { withCredentials: true }
      );
      if (res.data?.success) {
        dispatch(
          setAuthUser({
            ...authUser,
            fullName: res.data.user?.fullName || fullNameInput.trim(),
          })
        );
        toast.success("Profile name updated!", { id: toastId });
        setIsEditingName(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update name", { id: toastId });
    } finally {
      setSavingName(false);
    }
  };

  const settings = {
    notifications: true,
    darkMode: true,
    sound: true,
    ...(rawSettings || {}),
  };

  if (!isOpen) return null;

  const handleToggle = (key) => {
    dispatch(updateSettings({ [key]: !settings[key] }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const toastId = toast.loading("Uploading new profile photo...");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("profilePhoto", file);

      const res = await axios.put(`${BASE_URL}/api/v1/user/profile-photo`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data?.profilePhoto) {
        dispatch(
          setAuthUser({
            ...authUser,
            profilePhoto: res.data.profilePhoto,
          })
        );
        toast.success("Profile photo updated!", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to upload photo", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const isDarkMode = settings.darkMode;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div
        className={`border rounded-3xl w-full max-w-sm p-6 shadow-2xl relative transition-colors duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar ${
          isDarkMode
            ? "bg-slate-900 border-slate-700/80 text-white"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors ${
            isDarkMode
              ? "text-slate-400 hover:text-white hover:bg-white/10"
              : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <HiOutlineX size={20} />
        </button>

        <div className="flex flex-col">
          <h3
            className={`text-xl font-bold mb-4 border-b pb-2 ${
              isDarkMode ? "text-slate-100 border-slate-700" : "text-slate-800 border-slate-200"
            }`}
          >
            Profile & Settings
          </h3>

          {/* User Profile Preview & Cloudinary Upload */}
          <div className="flex flex-col items-center mb-5 pb-4 border-b border-white/10">
            <div className="relative group cursor-pointer">
              <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500 shadow-md relative"
              >
                <img
                  src={
                    authUser?.profilePhoto ||
                    `https://api.dicebear.com/10.x/loops/svg?seed=${authUser?.username || "user"}`
                  }
                  alt={authUser?.fullName}
                  className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <HiCamera size={22} className="text-white" />
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
            <p className="font-semibold text-sm mt-2">{authUser?.fullName}</p>
            <p className="text-xs text-slate-400">@{authUser?.username}</p>
            <button
              type="button"
              onClick={() => !uploading && fileInputRef.current?.click()}
              disabled={uploading}
              className="mt-2 text-xs text-blue-400 hover:text-blue-300 font-medium underline cursor-pointer disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Change Profile Photo"}
            </button>
          </div>

          <div className="space-y-4">
            {/* Global Notifications */}
            <div
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-colors ${
                isDarkMode
                  ? "bg-slate-800/40 border-slate-700/50"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl ${
                    isDarkMode ? "bg-slate-700/50 text-slate-300" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  <HiOutlineBell size={20} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>
                    Global Notifications
                  </p>
                  <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Push notifications for all chats
                  </p>
                </div>
              </div>
              <ToggleSwitch
                active={settings.notifications}
                onClick={() => handleToggle("notifications")}
              />
            </div>

            {/* App Sounds */}
            <div
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-colors ${
                isDarkMode
                  ? "bg-slate-800/40 border-slate-700/50"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl ${
                    isDarkMode ? "bg-slate-700/50 text-slate-300" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  <HiOutlineVolumeUp size={20} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>
                    App Sounds
                  </p>
                  <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Play sounds for incoming messages
                  </p>
                </div>
              </div>
              <ToggleSwitch
                active={settings.sound}
                onClick={() => handleToggle("sound")}
              />
            </div>

            {/* Dark Mode / Light Mode Toggle */}
            <div
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-colors ${
                isDarkMode
                  ? "bg-slate-800/40 border-slate-700/50"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl ${
                    isDarkMode ? "bg-slate-700/50 text-amber-400" : "bg-amber-100 text-amber-600"
                  }`}
                >
                  {isDarkMode ? <HiOutlineMoon size={20} /> : <HiOutlineSun size={20} />}
                </div>
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>
                    {isDarkMode ? "Dark Mode" : "Light Mode"}
                  </p>
                  <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Theme appearance ({isDarkMode ? "Dark" : "Light"})
                  </p>
                </div>
              </div>
              <ToggleSwitch
                active={settings.darkMode}
                onClick={() => handleToggle("darkMode")}
              />
            </div>
          </div>

          <button
            onClick={onClose}
            className={`mt-8 w-full py-2.5 px-4 border rounded-xl text-sm font-medium transition-colors ${
              isDarkMode
                ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200"
                : "bg-slate-900 hover:bg-slate-800 border-slate-900 text-white"
            }`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
