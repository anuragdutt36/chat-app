import React from "react";
import Message from "./Message";
import useGetMessages from "../hooks/useGetMessages";
import { useSelector } from "react-redux";
import useGetRealTimeMessage from "../hooks/useGetRealTimeMessage";

const Messages = ({ searchQuery = "" }) => {
  useGetMessages();
  useGetRealTimeMessage();
  const { messages } = useSelector((store) => store.message);

  const filteredMessages = searchQuery.trim()
    ? messages?.filter((m) =>
        m?.message?.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : messages;

  return (
    <div className="px-4 py-3 flex-1 overflow-auto custom-scrollbar flex flex-col gap-1">
      {filteredMessages && filteredMessages.length > 0 ? (
        filteredMessages.map((message) => {
          return <Message key={message._id} message={message} />;
        })
      ) : searchQuery.trim() ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-sm">
          <p className="bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800">
            No messages found matching &quot;{searchQuery}&quot;
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs">
          <p className="bg-slate-900/60 text-slate-400 px-4 py-1.5 rounded-full border border-slate-800/80 shadow-sm">
            🔒 Messages are end-to-end encrypted
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages;