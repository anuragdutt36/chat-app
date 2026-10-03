import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";

const OtherUser = ({ user }) => {
  const dispatch = useDispatch();
  const { selectedUser, onlineUsers, blockedUsers, appSettings } = useSelector((store) => store.user);
  const isOnline = onlineUsers?.includes(user._id);
  const isBlocked = blockedUsers?.includes(user._id);
  const isSelected = selectedUser?._id === user?._id;
  const isDarkMode = appSettings?.darkMode ?? true;

  const selectedUserHandler = (user) => {
    dispatch(setSelectedUser(user));
  };

  return (
    <div
      onClick={() => selectedUserHandler(user)}
      className={`${
        isSelected
          ? isDarkMode
            ? "bg-blue-600/25 border border-blue-500/40 text-white shadow-sm font-medium"
            : "bg-blue-600 border border-blue-600 text-white shadow-md font-medium"
          : isDarkMode
            ? "hover:bg-white/10 text-slate-200 hover:text-white border border-transparent"
            : "hover:bg-slate-200/80 text-slate-800 hover:text-slate-950 border border-transparent"
      } flex gap-3 items-center rounded-xl p-2.5 cursor-pointer transition-all duration-150 ease-in-out`}
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
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
            isDarkMode ? "border-slate-900" : "border-white"
          } ${isOnline ? "bg-emerald-400" : "bg-slate-400"}`}
        />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex justify-between items-center gap-1">
          <p className="font-semibold text-sm truncate">{user?.fullName}</p>
          {isBlocked ? (
            <span className="text-[10px] text-red-400 bg-red-400/10 px-1.5 py-0.2 rounded font-medium shrink-0">
              blocked
            </span>
          ) : isOnline ? (
            <span
              className={`text-[10px] font-medium shrink-0 ${
                isDarkMode ? "text-emerald-400" : "text-emerald-600"
              }`}
            >
              online
            </span>
          ) : null}
        </div>
        <p
          className={`text-xs truncate ${
            isSelected
              ? "text-blue-100 opacity-90"
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