import mongoose from "mongoose";

const TicketModel = mongoose.model('ticket', new mongoose.Schema({
    code: Number,
    purchase_datatime: String,
    amount: Number,
    purchaser: 
     {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
   
}))

export default TicketModel