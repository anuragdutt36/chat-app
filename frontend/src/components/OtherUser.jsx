import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { clearUnread } from "../redux/messageSlice";

const OtherUser = ({ user }) => {
  const dispatch = useDispatch();
  const { selectedUser, onlineUsers, blockedUsers, appSettings } = useSelector((store) => store.user);
  const { unreadCounts } = useSelector((store) => store.message);

  const isOnline = Boolean(onlineUsers && user?._id && onlineUsers.some(id => id?.toString() === user._id.toString()));
  const isBlocked = Boolean(blockedUsers && user?._id && blockedUsers.some(id => id?.toString() === user._id.toString()));
  const isSelected = selectedUser?._id?.toString() === user?._id?.toString();
  const isDarkMode = appSettings?.darkMode ?? true;

  const unreadCount = unreadCounts?.[user?._id] || 0;

  const selectedUserHandler = (user) => {
    dispatch(setSelectedUser(user));
    if (user?._id) {
      dispatch(clearUnread(user._id));
    }
  };

  return (
    <div
      onClick={() => selectedUserHandler(user)}
      className={`${
        isSelected
          ? isDarkMode
            ? "bg-blue-600/25 border border-blue-500/40 text-white shadow-sm font-medium"
            : "bg-blue-600 border border-blue-600 text-white shadow-md font-medium"
          : unreadCount > 0
            ? isDarkMode
              ? "bg-blue-500/15 border border-blue-500/30 text-slate-100 font-semibold"
              : "bg-blue-50 border border-blue-200 text-slate-900 font-semibold"
            : isDarkMode
              ? "hover:bg-white/10 text-slate-200 hover:text-white border border-transparent"
              : "hover:bg-slate-200/80 text-slate-800 hover:text-slate-950 border border-transparent"
      } flex gap-3 items-center rounded-xl p-2.5 cursor-pointer transition-all duration-150 ease-in-out relative group`}
    >
      <div className="relative shrink-0">
        <div
          className={`w-11 h-11 rounded-full overflow-hidden border shadow-sm ${
            isDarkMode ? "border-white/20 bg-slate-800" : "border-slate-300 bg-slate-200"
          }`}
        >
          <img
            src={user?.profilePhoto || `https://api.dicebear.com/10.x/loops/svg?seed=${user?.username || "user"}`}
            alt={user?.fullName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = `https://api.dicebear.com/10.x/loops/svg?seed=${user?.username || "user"}`;
            }}
          />
        </div>

        {/* Online Indicator */}
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
            isDarkMode ? "border-slate-900" : "border-white"
          } ${isOnline ? "bg-emerald-400" : "bg-slate-400"}`}
        />

        {/* Unread dot indicator on avatar if unread */}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-500 rounded-full border-2 border-slate-900 animate-ping" />
        )}
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex justify-between items-center gap-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <p className="font-semibold text-sm truncate">{user?.fullName}</p>
            {/* New Message Tag Badge next to Name */}
            {unreadCount > 0 && (
              <span className="bg-blue-600 text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full shadow-xs shrink-0 animate-pulse">
                New
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Unread Count Badge */}
            {unreadCount > 0 ? (
              <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[11px] font-bold text-white bg-blue-600 rounded-full shadow-sm">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            ) : isBlocked ? (
              <span className="text-[10px] text-red-400 bg-red-400/10 px-1.5 py-0.2 rounded font-medium">
                blocked
              </span>
            ) : isOnline ? (
              <span
                className={`text-[10px] font-medium ${
                  isDarkMode ? "text-emerald-400" : "text-emerald-600"
                }`}
              >
                online
              </span>
            ) : null}
          </div>
        </div>

        <p
          className={`text-xs truncate ${
            isSelected
              ? "text-blue-100 opacity-90"
              : unreadCount > 0
                ? "text-blue-400 font-medium"
                : isDarkMode
                  ? "text-slate-400"
                  : "text-slate-500"
          }`}
        >
          @{user?.username}
        </p>
      </div>
    </div>
  );
};

export default OtherUser;