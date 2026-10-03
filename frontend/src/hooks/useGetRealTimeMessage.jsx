import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "../redux/messageSlice";

const useGetRealTimeMessage = () => {
  const { socket } = useSelector((store) => store.socket);
  const { messages } = useSelector((store) => store.message);
  const { blockedUsers } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      // Do not accept real-time messages if the sender is in blocked list
      if (blockedUsers && Array.isArray(blockedUsers) && blockedUsers.includes(newMessage?.senderId)) {
        return;
      }
      dispatch(setMessages([...(messages || []), newMessage]));
    };

    socket?.on("newMessage", handleNewMessage);
    return () => socket?.off("newMessage", handleNewMessage);
  }, [socket, messages, blockedUsers, dispatch]);
};

export default useGetRealTimeMessage;