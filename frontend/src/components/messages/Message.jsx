import React from "react";
import { useAuthContext } from "../../context/AuthContext";
import useConverstation from "../../zustand/useConversation";
const Message = ({ message }) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConverstation();
  const fromMe = message.senderId === authUser._id;
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const profilePic = fromMe
    ? authUser.profile
    : selectedConversation.profilePic;
  const bubbleBgColor = fromMe ? "bg-blue-500" : " ";
  return (
    <div className={`chat ${chatClassName}`}>
      <div className={`chat-bubble text-white  ${bubbleBgColor}`}>
        {message.message}
      </div>
      <div className="chat-image-avatar">
        <div className="w-10 rounded-full">
          <img alt="Tailwind CSS chat bubble component" src={profilePic} />
        </div>
      </div>
      <div className={`chat-footer opacity-50 text-xs flex gap-1 items-center`}>
        {message.createdAt}
      </div>
    </div>
  );
};

export default Message;
