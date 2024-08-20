import { createContext, useEffect, useState, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";
const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (authUser) {
      const socket = io("https://chat-app-123e.onrender.com", {
        query: {
          userId: authUser._id,
        },
      });
      // console.log("authuserid", authUser._id);
      // socket.on("connect", () => {
      //   console.log("Socket connected with ID:", socket.id);
      // });

      // socket.on("disconnect", () => {
      //   console.log("Socket disconnected");
      // });

      // socket.on("connect_error", (error) => {
      //   console.log("Socket connection error:", error);
      // });
      // console.log("Socket ID on connect:", socket.id);

      setSocket(socket);

      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);
  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
// export { SocketContextProvider, useSocketContext };
