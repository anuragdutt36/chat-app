import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMessages, incrementUnread } from "../redux/messageSlice";
import toast from "react-hot-toast";

const useGetRealTimeMessage = () => {
  const { socket } = useSelector((store) => store.socket);
  const { messages } = useSelector((store) => store.message);
  const { selectedUser, blockedUsers, otherUsers } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      if (!newMessage?.senderId) return;

      // Do not accept real-time messages if the sender is blocked
      if (
        blockedUsers &&
        Array.isArray(blockedUsers) &&
        blockedUsers.includes(newMessage.senderId)
      ) {
        return;
      }

      // Check if message belongs to currently open active conversation
      const isCurrentChat =
        selectedUser?._id?.toString() === newMessage.senderId.toString();

      if (isCurrentChat) {
        dispatch(setMessages([...(messages || []), newMessage]));
      } else {
        // Increment unread count for the sender user in sidebar
        dispatch(incrementUnread(newMessage.senderId));

        // Find sender details for toast notification
        const sender = otherUsers?.find(
          (u) => u._id?.toString() === newMessage.senderId.toString()
        );
        const senderName = sender?.fullName || "Someone";
        
        toast(`New message from ${senderName}`, {
          icon: "💬",
          duration: 3000,
        });
      }
    };

    socket?.on("newMessage", handleNewMessage);
    return () => socket?.off("newMessage", handleNewMessage);
  }, [socket, messages, selectedUser, blockedUsers, otherUsers, dispatch]);
};

export default useGetRealTimeMessage;