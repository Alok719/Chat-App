import mongoose, { Mongoose } from "mongoose";
const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: [],
      },
    ],
  },
  { timestamps: true }
); // timestap will allow when the message was send and received

const Conversation = new mongoose.model("Conversation", conversationSchema);
export default Conversation;
