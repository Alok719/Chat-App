import mongoose from "mongoose";
const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // type here is basically a reference from User
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // type here is basically a reference from User
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
); // timestap will allow when the message was send and received

const Message = new mongoose.model("Message", messageSchema);
export default Message;
