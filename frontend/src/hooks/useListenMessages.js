import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages } = useConversation();
  useEffect(() => {
    if (socket) {
      console.log("Socket connected with ID:", socket.id);
    } else {
      console.log("Socket not connected");
    }
    socket?.on("newMessage", (newMessage) => {
      console.log(`New message received:`, newMessage);

      setMessages([...messages, newMessage]);
      // setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket?.off("newMessage");
    };
  }, [socket, messages, setMessages]);
};

export default useListenMessages;
