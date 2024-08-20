import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    // const receiverId = req.params.id; // we can also destructe it like: const {id}=req.params
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // await conversation.save();
    // await newMessage.save();   both will not run simulatanoeuly so run them simulataneously we need to use promise to save them

    await Promise.all([conversation.save(), newMessage.save()]);

    //socket Io functionality will go here
    const receiversocketId = getReceiverSocketId(receiverId);
    // console.log("reciverID", receiverId);
    if (receiversocketId) {
      io.to(receiversocketId).emit("newMessage", newMessage);
    }
    // console.log(`New message sent:`, newMessage);
    // console.log(`Sending to socketID:`, receiversocketId);
    res.status(201).json(newMessage);
  } catch (error) {
    console.log(`error in the sendMessage controller`, error.message);
    res.status(400).json({ error: `internal server error` });
  }
};

const getMessage = async (req, res) => {
  try {
    const userChatId = req.params.id;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userChatId] },
    }).populate("messages"); // populate replaces the messages field (presumably an array of message IDs or references) with the actual message documents from the Message collection.
    if (!conversation) {
      return res.status(200).json([]);
    }
    const messages = conversation.messages;
    return res.status(200).json(messages);
  } catch (error) {
    console.log(`error in the getMessage controller`, error.message);
    return res.status(400).json({ error: `internal server error` });
  }
};
export { sendMessage, getMessage };
