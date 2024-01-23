import ChatModel from "../models/chatmongoose.models.js"

export default class Chats {
    getChats = async () => { return ChatModel.find().lean().exec() }
   
    
    addChats = async chat => { return ChatModel.create(chat) }

    
}