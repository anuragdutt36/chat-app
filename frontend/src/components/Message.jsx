import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { extractTime } from "../utils/extractTime";
import { BsCheck2All, BsCheck2 } from "react-icons/bs";
import "../index.css";

const Message = ({ message }) => {
  const scroll = useRef();
  const { authUser, selectedUser, onlineUsers, appSettings } = useSelector((store) => store.user);
  const formattedTime = extractTime(message.createdAt);
  const isMe = message?.senderId === authUser?._id;
  const isRead = message?.isRead || onlineUsers?.includes(selectedUser?._id);
  const isDarkMode = appSettings?.darkMode ?? true;

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={scroll}
      className={`chat ${isMe ? "chat-end" : "chat-start"} my-0.5`}
    >
      <div className="chat-image avatar">
        <div
          className={`w-8 h-8 rounded-full overflow-hidden border shadow-sm ${
            isDarkMode ? "border-white/20 bg-slate-800" : "border-slate-300 bg-slate-200"
          }`}
        >
          <img
            alt="avatar"
            src={
              (isMe ? authUser?.profilePhoto : selectedUser?.profilePhoto) ||
              `https://api.dicebear.com/10.x/loops/svg?seed=${
                (isMe ? authUser?.username : selectedUser?.username) || "user"
              }`
            }
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = `https://api.dicebear.com/10.x/loops/svg?seed=${
                (isMe ? authUser?.username : selectedUser?.username) || "user"
              }`;
            }}
          />
        </div>
      </div>
      <div
        className={`chat-bubble text-sm leading-relaxed max-w-[75%] px-4 py-2.5 shadow-sm break-words ${
          isMe
            ? "bg-blue-600 text-white rounded-2xl rounded-br-xs"
            : isDarkMode
              ? "bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-2xl rounded-bl-xs"
              : "bg-white text-slate-800 border border-slate-200/90 shadow-xs rounded-2xl rounded-bl-xs"
        }`}
      >
        {message?.message}
      </div>
      <div
        className={`chat-footer text-[10px] mt-0.5 flex gap-1 items-center font-normal px-1 ${
          isDarkMode ? "opacity-80 text-slate-300" : "opacity-90 text-slate-500"
        }`}
      >
        <span>{formattedTime}</span>
        {isMe && (
          isRead ? (
            <BsCheck2All className="text-sky-400 font-bold" size={15} title="Read" />
          ) : (
            <BsCheck2 className={isDarkMode ? "text-slate-400 font-medium" : "text-slate-500 font-medium"} size={14} title="Sent" />
          )
        )}
      </div>
    </div>
  );
};

export default Message;

