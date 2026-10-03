import React, { useState, useRef, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import { BsEmojiSmile, BsEmojiSmileFill } from "react-icons/bs";
import EmojiPicker, { Theme } from "emoji-picker-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";
import { BASE_URL } from "..";

import toast from "react-hot-toast";

const SendInput = () => {
  const [message, setMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const pickerRef = useRef(null);
  const buttonRef = useRef(null);

  const dispatch = useDispatch();
  const { selectedUser, blockedUsers, appSettings } = useSelector((store) => store.user);
  const { messages } = useSelector((store) => store.message);

  const isDarkMode = appSettings?.darkMode ?? true;
  const isBlocked = blockedUsers?.includes(selectedUser?._id);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!message.trim() || isBlocked || loading) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/message/send/${selectedUser?._id}`,
        { message: message.trim() },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res?.data?.newMessage) {
        const currentMessages = Array.isArray(messages) ? messages : [];
        dispatch(setMessages([...currentMessages, res.data.newMessage]));
        setMessage("");
        setShowPicker(false);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error?.response?.data?.message || "Failed to send message. Please log in again if session expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative p-3.5 border-t transition-all duration-300 ${
        isDarkMode
          ? "bg-slate-900/40 backdrop-blur-xl border-white/10"
          : "bg-white/80 backdrop-blur-xl border-slate-200"
      }`}
    >
      {/* Emoji Picker Popup */}
      {showPicker && (
        <div
          ref={pickerRef}
          className={`absolute bottom-20 left-4 z-50 shadow-2xl rounded-2xl overflow-hidden border transition-all animate-in fade-in zoom-in-95 duration-150 ${
            isDarkMode ? "border-slate-700/80" : "border-slate-300"
          }`}
        >
          <EmojiPicker
            theme={isDarkMode ? Theme.DARK : Theme.LIGHT}
            onEmojiClick={onEmojiClick}
            autoFocusSearch={false}
            searchPlaceHolder="Search emoji..."
            width={320}
            height={400}
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}

      <form onSubmit={onSubmitHandler} className="relative flex items-center gap-2.5">
        <div className="w-full relative flex items-center">
          <button
            ref={buttonRef}
            type="button"
            disabled={isBlocked}
            className={`absolute left-3.5 p-1 rounded-full transition-colors ${
              showPicker
                ? "text-blue-500 bg-blue-500/20"
                : isDarkMode
                  ? "text-slate-400 hover:text-slate-100 hover:bg-white/10"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/60"
            } ${isBlocked ? "opacity-50 cursor-not-allowed" : ""}`}
            title="Choose Emoji"
            onClick={() => setShowPicker((prev) => !prev)}
          >
            {showPicker ? <BsEmojiSmileFill size={20} /> : <BsEmojiSmile size={20} />}
          </button>

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isBlocked}
            type="text"
            placeholder={isBlocked ? "You blocked this contact." : "Type a message..."}
            className={`w-full text-sm focus:ring-1 focus:ring-blue-500/50 focus:outline-none transition-all rounded-xl py-3 pl-12 pr-4 ${
              isDarkMode
                ? "bg-slate-900/50 border border-slate-700/60 text-slate-100 focus:bg-slate-900/80 focus:border-blue-500/80 placeholder-slate-400"
                : "bg-white border border-slate-300 text-slate-900 focus:bg-white focus:border-blue-500 placeholder-slate-400 shadow-xs"
            } ${isBlocked ? "placeholder-red-400/70 opacity-60 cursor-not-allowed" : ""}`}
          />
        </div>

        <button
          type="submit"
          disabled={!message.trim() || isBlocked}
          className="flex items-center justify-center bg-blue-600 hover:bg-blue-500 active:scale-95 disabled:opacity-40 disabled:hover:bg-blue-600 disabled:cursor-not-allowed text-white p-3 rounded-xl shadow-md transition-all shrink-0"
          title="Send message"
        >
          <IoSend size={18} />
        </button>
      </form>
    </div>
  );
};

export default SendInput;

