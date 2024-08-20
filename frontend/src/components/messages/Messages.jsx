import { useEffect, useRef } from "react";
import useGetmessages from "../../hooks/useGetmessages";
import MessageSkeleton from "../skeletons/messageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";

const Messages = () => {
  const { messages, loading } = useGetmessages();
  useListenMessages();
  const lastMessageRef = useRef();
  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behaviour: "smooth" });
    }, 100);
  }, [messages]);
  return (
    <div className="px-4 flex-1 overflow-auto">
      {!loading &&
        messages.length > 0 &&
        messages.map((message) => (
          //prev key key={message._id}
          //new key key={`${message._id}-${index}`}
          <div key={message._id} ref={lastMessageRef}>
            <Message message={message} />
          </div>
        ))}

      {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
      {!loading && messages.length === 0 && (
        <p className="text-center">Send a message to start the conversation</p>
      )}
    </div>
  );
};
export default Messages;
