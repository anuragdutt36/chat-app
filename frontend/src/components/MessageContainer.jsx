import React, { useState, useRef, useEffect } from "react";
import SendInput from "./SendInput";
import Messages from "./Messages";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "../redux/messageSlice";
import { toggleMuteUser, toggleBlockUser, setBlockedUsers, setSelectedUser } from "../redux/userSlice";
import toast from "react-hot-toast";
import axios from "axios";
import { BASE_URL } from "..";
import {
  HiDotsVertical,
  HiOutlineUser,
  HiOutlineSearch,
  HiOutlineBell,
  HiOutlineTrash,
  HiOutlineBan,
  HiOutlineFlag,
  HiOutlineX,
  HiChevronLeft,
} from "react-icons/hi";
import { BiBellOff } from "react-icons/bi";


const MessageContainer = () => {
  const { selectedUser, authUser, onlineUsers, mutedUsers, blockedUsers, appSettings } = useSelector(
    (store) => store.user
  );
  const dispatch = useDispatch();

  const isDarkMode = appSettings?.darkMode ?? true;

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isMuted = Boolean(mutedUsers && selectedUser?._id && mutedUsers.some((id) => id?.toString() === selectedUser._id.toString()));
  const isBlocked = Boolean(blockedUsers && selectedUser?._id && blockedUsers.some((id) => id?.toString() === selectedUser._id.toString()));

  const menuRef = useRef(null);

  const isOnline = Boolean(onlineUsers && selectedUser?._id && onlineUsers.some((id) => id?.toString() === selectedUser._id.toString()));

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset states when selected user changes
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
  }, [selectedUser?._id]);

  const handleToggleMute = () => {
    dispatch(toggleMuteUser(selectedUser?._id));
    setMenuOpen(false);
    if (!isMuted) {
      toast.success(`Muted notifications for ${selectedUser?.fullName}`);
    } else {
      toast.success(`Unmuted notifications for ${selectedUser?.fullName}`);
    }
  };

  const handleClearChat = async () => {
    setMenuOpen(false);
    if (!selectedUser?._id) return;
    if (window.confirm("Are you sure you want to permanently clear this chat history from the database?")) {
      try {
        await axios.delete(`${BASE_URL}/api/v1/message/clear/${selectedUser._id}`);
        dispatch(setMessages([]));
        toast.success("Chat history cleared from database");
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Failed to clear chat history");
      }
    }
  };

  const handleToggleBlock = async () => {
    setMenuOpen(false);
    if (!selectedUser?._id) return;
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/block/${selectedUser._id}`);
      if (res.data?.blockedUsers) {
        dispatch(setBlockedUsers(res.data.blockedUsers));
      } else {
        dispatch(toggleBlockUser(selectedUser._id));
      }
      if (res.data?.isBlocked) {
        toast.error(`${selectedUser?.fullName} has been blocked`);
      } else {
        toast.success(`${selectedUser?.fullName} has been unblocked`);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update block status");
    }
  };

  const handleReport = () => {
    setMenuOpen(false);
    toast.success("Report submitted. Our team will review this user.");
  };

  return (
    <>
      {selectedUser !== null ? (
        <div
          className={`flex-1 w-full h-full flex flex-col relative transition-all duration-300 ${
            isDarkMode ? "bg-slate-950/40" : "bg-slate-100/40"
          }`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between px-3.5 sm:px-6 py-3 sm:py-3.5 border-b shadow-sm z-20 transition-all duration-300 ${
              isDarkMode
                ? "bg-slate-900/60 backdrop-blur-xl text-white border-white/10"
                : "bg-white/80 backdrop-blur-xl text-slate-900 border-slate-200"
            }`}
          >
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {/* Mobile Back Button */}
              <button
                type="button"
                onClick={() => dispatch(setSelectedUser(null))}
                className={`md:hidden p-1.5 -ml-1 rounded-xl transition-colors shrink-0 ${
                  isDarkMode
                    ? "text-slate-300 hover:text-white hover:bg-white/10 active:bg-white/20"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 active:bg-slate-300/70"
                }`}
                title="Back to contacts"
              >
                <HiChevronLeft size={24} />
              </button>

              <div className="relative shrink-0">
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border shadow-sm ${
                    isDarkMode ? "border-white/20 bg-slate-800" : "border-slate-300 bg-slate-200"
                  }`}
                >
                  <img
                    src={selectedUser?.profilePhoto || `https://api.dicebear.com/10.x/loops/svg?seed=${selectedUser?.username || "user"}`}
                    alt="user-profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://api.dicebear.com/10.x/loops/svg?seed=${selectedUser?.username || "user"}`;
                    }}
                  />
                </div>
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
                    isDarkMode ? "border-slate-900" : "border-white"
                  } ${isOnline ? "bg-emerald-400" : "bg-slate-400"}`}
                />
              </div>
              <div>
                <p
                  className={`font-semibold text-base leading-tight tracking-wide ${
                    isDarkMode ? "text-slate-100" : "text-slate-900"
                  }`}
                >
                  {selectedUser?.fullName}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p
                    className={`text-xs font-medium ${
                      isOnline
                        ? "text-emerald-400"
                        : isDarkMode
                          ? "text-slate-400"
                          : "text-slate-500"
                    }`}
                  >
                    {isOnline ? "Active now" : "Offline"}
                  </p>
                  {isMuted && (
                    <span className="text-[10px] text-amber-400/90 bg-amber-400/10 px-1.5 py-0.2 rounded font-medium">
                      Muted
                    </span>
                  )}
                  {isBlocked && (
                    <span className="text-[10px] text-red-400/90 bg-red-400/10 px-1.5 py-0.2 rounded font-medium">
                      Blocked
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Header Options - Three Dot Menu */}
            <div className="flex items-center gap-1 relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setSearchOpen((prev) => !prev)}
                className={`p-2 rounded-xl transition-all ${
                  searchOpen
                    ? "bg-blue-600/30 text-blue-400"
                    : isDarkMode
                      ? "text-slate-400 hover:text-white hover:bg-white/10"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
                title="Search messages"
              >
                <HiOutlineSearch size={19} />
              </button>

              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className={`p-2 rounded-xl transition-all ${
                  menuOpen
                    ? isDarkMode
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-900"
                    : isDarkMode
                      ? "text-slate-400 hover:text-white hover:bg-white/10"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
                title="Chat Options"
              >
                <HiDotsVertical size={19} />
              </button>

              {/* Three Dot Dropdown Menu */}
              {menuOpen && (
                <div
                  className={`absolute right-0 top-12 w-56 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 border ${
                    isDarkMode
                      ? "bg-slate-900/95 backdrop-blur-2xl border-slate-700/80 text-slate-200"
                      : "bg-white/95 backdrop-blur-2xl border-slate-200 text-slate-800 shadow-slate-900/15"
                  }`}
                >
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setProfileModalOpen(true);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${
                      isDarkMode
                        ? "text-slate-200 hover:text-white hover:bg-white/10"
                        : "text-slate-700 hover:text-slate-950 hover:bg-slate-100"
                    }`}
                  >
                    <HiOutlineUser size={18} className={isDarkMode ? "text-slate-400" : "text-slate-500"} />
                    <span>View Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setSearchOpen(true);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${
                      isDarkMode
                        ? "text-slate-200 hover:text-white hover:bg-white/10"
                        : "text-slate-700 hover:text-slate-950 hover:bg-slate-100"
                    }`}
                  >
                    <HiOutlineSearch size={18} className={isDarkMode ? "text-slate-400" : "text-slate-500"} />
                    <span>Search in Chat</span>
                  </button>

                  <button
                    onClick={handleToggleMute}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${
                      isDarkMode
                        ? "text-slate-200 hover:text-white hover:bg-white/10"
                        : "text-slate-700 hover:text-slate-950 hover:bg-slate-100"
                    }`}
                  >
                    {isMuted ? (
                      <>
                        <HiOutlineBell size={18} className="text-amber-400" />
                        <span>Unmute Notifications</span>
                      </>
                    ) : (
                      <>
                        <BiBellOff size={18} className={isDarkMode ? "text-slate-400" : "text-slate-500"} />
                        <span>Mute Notifications</span>
                      </>
                    )}
                  </button>

                  <div className={`border-t my-1.5 ${isDarkMode ? "border-white/10" : "border-slate-200"}`} />

                  <button
                    onClick={handleClearChat}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${
                      isDarkMode
                        ? "text-slate-200 hover:text-white hover:bg-white/10"
                        : "text-slate-700 hover:text-slate-950 hover:bg-slate-100"
                    }`}
                  >
                    <HiOutlineTrash size={18} className={isDarkMode ? "text-slate-400" : "text-slate-500"} />
                    <span>Clear Messages</span>
                  </button>

                  <button
                    onClick={handleToggleBlock}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors text-left font-medium"
                  >
                    <HiOutlineBan size={18} />
                    <span>{isBlocked ? "Unblock Contact" : "Block Contact"}</span>
                  </button>

                  <button
                    onClick={handleReport}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors text-left font-medium"
                  >
                    <HiOutlineFlag size={18} />
                    <span>Report Contact</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* In-chat Search Bar (toggled) */}
          {searchOpen && (
            <div
              className={`px-6 py-2.5 border-b flex items-center gap-3 animate-in slide-in-from-top-2 duration-150 z-10 ${
                isDarkMode
                  ? "bg-slate-900/80 backdrop-blur-md border-white/10 text-slate-200"
                  : "bg-white/90 backdrop-blur-md border-slate-200 text-slate-800"
              }`}
            >
              <HiOutlineSearch size={18} className={isDarkMode ? "text-slate-400" : "text-slate-500"} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages in this chat..."
                className={`bg-transparent border-none text-sm focus:outline-none flex-1 ${
                  isDarkMode ? "text-slate-200 placeholder-slate-400" : "text-slate-800 placeholder-slate-400"
                }`}
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-slate-400 hover:text-slate-600 px-2 py-0.5"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className={`p-1 rounded-lg transition-colors ${
                  isDarkMode ? "text-slate-400 hover:text-white hover:bg-white/10" : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <HiOutlineX size={18} />
              </button>
            </div>
          )}

          {/* Messages Area */}
          <Messages searchQuery={searchQuery} />

          {/* Input Area */}
          <SendInput />

          {/* Profile Modal */}
          {profileModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
              <div
                className={`border rounded-3xl w-full max-w-sm p-6 shadow-2xl relative ${
                  isDarkMode ? "bg-slate-900 border-slate-700/80 text-white" : "bg-white border-slate-200 text-slate-900"
                }`}
              >
                <button
                  onClick={() => setProfileModalOpen(false)}
                  className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors ${
                    isDarkMode ? "text-slate-400 hover:text-white hover:bg-white/10" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <HiOutlineX size={20} />
                </button>

                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-24 h-24 rounded-full overflow-hidden border-4 shadow-xl mb-4 relative ${
                      isDarkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-slate-100"
                    }`}
                  >
                    <img
                      src={selectedUser?.profilePhoto || `https://api.dicebear.com/10.x/loops/svg?seed=${selectedUser?.username || "user"}`}
                      alt={selectedUser?.fullName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://api.dicebear.com/10.x/loops/svg?seed=${selectedUser?.username || "user"}`;
                      }}
                    />
                  </div>
                  <h3 className={`text-xl font-bold ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
                    {selectedUser?.fullName}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>@{selectedUser?.username}</p>
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        isOnline
                          ? isDarkMode
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-emerald-100 text-emerald-700 border border-emerald-300"
                          : isDarkMode
                            ? "bg-slate-800 text-slate-400 border border-slate-700"
                            : "bg-slate-100 text-slate-600 border border-slate-300"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isOnline ? "bg-emerald-400" : "bg-slate-400"
                        }`}
                      />
                      {isOnline ? "Online" : "Offline"}
                    </span>
                  </div>

                  <div
                    className={`w-full mt-6 space-y-3 rounded-2xl p-4 border text-left ${
                      isDarkMode ? "bg-slate-800/40 border-slate-700/50" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className={isDarkMode ? "text-slate-400" : "text-slate-500"}>Gender</span>
                      <span className={`capitalize font-medium ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>
                        {selectedUser?.gender || "Not specified"}
                      </span>
                    </div>
                    <div className={`border-t ${isDarkMode ? "border-slate-700/40" : "border-slate-200"}`} />
                    <div className="flex justify-between items-center text-xs">
                      <span className={isDarkMode ? "text-slate-400" : "text-slate-500"}>Account Status</span>
                      <span className="text-emerald-500 font-medium">Active Member</span>
                    </div>
                    <div className={`border-t ${isDarkMode ? "border-slate-700/40" : "border-slate-200"}`} />
                    <div className="flex justify-between items-center text-xs">
                      <span className={isDarkMode ? "text-slate-400" : "text-slate-500"}>Notifications</span>
                      <span className={isMuted ? "text-amber-500 font-medium" : isDarkMode ? "text-slate-300 font-medium" : "text-slate-700 font-medium"}>
                        {isMuted ? "Muted" : "Enabled"}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setProfileModalOpen(false)}
                    className={`mt-6 w-full py-2.5 px-4 border rounded-xl text-sm font-medium transition-colors ${
                      isDarkMode
                        ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200"
                        : "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800"
                    }`}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`hidden md:flex flex-1 flex-col justify-center items-center h-full px-6 transition-all duration-300 ${
            isDarkMode ? "bg-slate-950/30 backdrop-blur-md text-white" : "bg-slate-50/70 backdrop-blur-md text-slate-900"
          }`}
        >
          <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 shadow-inner">
            <svg
              className="w-10 h-10 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.7}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h2 className={`text-2xl font-bold tracking-tight mb-2 ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
            Welcome, {authUser?.fullName}!
          </h2>
          <p className={`text-sm max-w-sm text-center leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
            Select a contact from the sidebar to view conversations and start messaging in real time.
          </p>
        </div>
      )}
    </>
  );
};

export default MessageContainer;

