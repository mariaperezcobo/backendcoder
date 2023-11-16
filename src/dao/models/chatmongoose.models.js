import mongoose from 'mongoose'

const chatCollection = 'chatmongoose'

const chatSchema = new mongoose.Schema({
    usuario: String,
    mensaje: String
})

const ChatModel = mongoose.model (chatCollection, chatSchema)

export default ChatModel