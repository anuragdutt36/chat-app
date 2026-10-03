import React, { useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { HiOutlineLogout, HiX, HiOutlineCog } from "react-icons/hi";
import OtherUsers from "./OtherUsers";
import SettingsModal from "./SettingsModal";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  setAuthUser,
  setOtherUsers,
  setSelectedUser,
} from "../redux/userSlice";
import { setMessages } from "../redux/messageSlice";
import { BASE_URL } from "..";

const Sidebar = () => {
  const [search, setSearch] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { authUser, selectedUser, appSettings } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isDarkMode = appSettings?.darkMode ?? true;

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/user/logout`);
      navigate("/login");
      toast.success(res.data.message || "Logged out successfully");
      dispatch(setAuthUser(null));
      dispatch(setMessages(null));
      dispatch(setOtherUsers(null));
      dispatch(setSelectedUser(null));
    } catch (error) {
      console.log(error);
      toast.error("Logout failed");
    }
  };

  return (
    <div
      className={`border-r md:border-r border-transparent ${
        selectedUser ? "hidden md:flex" : "flex"
      } w-full md:w-[280px] lg:w-[320px] md:shrink-0 h-full p-3.5 sm:p-4 flex-col transition-all duration-300 ${
        isDarkMode
          ? "border-white/10 bg-slate-900/60 backdrop-blur-xl text-slate-100"
          : "border-slate-200/80 bg-slate-50/80 backdrop-blur-xl text-slate-800"
      }`}
    >
      {/* Current User Card */}
      <div
        className={`flex items-center justify-between pb-3.5 border-b ${
          isDarkMode ? "border-white/10" : "border-slate-200"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full overflow-hidden border shadow-sm ${
              isDarkMode ? "border-white/20 bg-slate-800" : "border-slate-300 bg-slate-200"
            }`}
          >
            <img
              src={authUser?.profilePhoto || `https://api.dicebear.com/10.x/loops/svg?seed=${authUser?.username || "user"}`}
              alt={authUser?.fullName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://api.dicebear.com/10.x/loops/svg?seed=${authUser?.username || "user"}`;
              }}
            />
          </div>
          <div className="flex flex-col">
            <p
              className={`font-semibold text-sm leading-tight truncate max-w-[140px] ${
                isDarkMode ? "text-slate-100" : "text-slate-900"
              }`}
            >
              {authUser?.fullName}
            </p>
            <p
              className={`text-xs truncate max-w-[140px] ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              @{authUser?.username}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setSettingsOpen(true)}
            className={`p-2 rounded-xl transition-all ${
              isDarkMode
                ? "text-slate-400 hover:text-white hover:bg-white/10"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/70"
            }`}
            title="Settings"
          >
            <HiOutlineCog size={18} />
          </button>
          <button
            onClick={logoutHandler}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
            title="Logout"
          >
            <HiOutlineLogout size={18} />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="py-3">
        <div className="relative flex items-center">
          <BiSearchAlt2
            className={`absolute left-3.5 w-4 h-4 ${
              isDarkMode ? "text-slate-400" : "text-slate-500"
            }`}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full border text-xs rounded-xl py-2.5 pl-10 pr-8 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/40 transition-all ${
              isDarkMode
                ? "bg-slate-800/60 border-slate-700/60 text-slate-200 placeholder-slate-400"
                : "bg-white border-slate-300 text-slate-800 placeholder-slate-400 shadow-xs"
            }`}
            type="text"
            placeholder="Search conversations..."
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className={`absolute right-2.5 ${
                isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-400 hover:text-slate-700"
              }`}
            >
              <HiX size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="flex items-center justify-between px-1 pb-1">
        <span
          className={`text-[11px] font-semibold uppercase tracking-wider ${
            isDarkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          Direct Messages
        </span>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pr-1">
        <OtherUsers search={search} />
      </div>

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

export default Sidebar;

