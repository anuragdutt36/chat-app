import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req,res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const {message} = req.body;

        if (!senderId || !receiverId || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let gotConversation = await Conversation.findOne({
            participants:{$all : [senderId, receiverId]},
        });

        if(!gotConversation){
            gotConversation = await Conversation.create({
                participants:[senderId, receiverId]
            })
        };
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });
        if(newMessage){
            gotConversation.messages.push(newMessage._id);
        };
        

        await Promise.all([gotConversation.save(), newMessage.save()]);
         
        // SOCKET IO
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        return res.status(201).json({
            newMessage
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to send message" });
    }
}
export const getMessage = async (req,res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.id;

        // Mark messages received from receiverId as read
        await Message.updateMany(
            { senderId: receiverId, receiverId: senderId, isRead: false },
            { $set: { isRead: true } }
        );

        const conversation = await Conversation.findOne({
            participants:{$all : [senderId, receiverId]}
        }).populate("messages"); 
        return res.status(200).json(conversation?.messages || []);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to get messages" });
    }
}