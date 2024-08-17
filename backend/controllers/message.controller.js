import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const receiverId = req.params.id; // we can also destructe it like: const {id}=req.params
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
      senderId: senderId,
      receiverId: receiverId,
      message: message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    //socket Io functionality will go here

    // await conversation.save();
    // await newMessage.save();   both will not run simulatanoeuly so run them simulataneously we need to use promise to save them

    Promise.all([conversation.save(), newMessage.save()]);

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
      participants: { $all: [userChatId, senderId] },
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
