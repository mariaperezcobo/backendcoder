import mongoose from "mongoose";

const TicketModel = mongoose.model('ticket', new mongoose.Schema({
    code: Number,
    purchase_datatime: String,
    amount: Number,
    purchaser: String,
   
   
}))

export default TicketModel