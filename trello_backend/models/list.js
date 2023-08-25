const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    id: String,
    text: String,
    price: String,
    quantity: Number,
    date: { type: String, default: new Date().toISOString() }, // If you want to store the current date-time as a string
    unit: String,
    comment: String,
    deliveryDate: String,
    orderedBy: String,
    status: String,
    payment: String
});


const listSchema = new mongoose.Schema({
    id: String,
    text: String,
    tasks: [taskSchema], // Embed the taskSchema within the listSchema
});
const List = mongoose.model('List', listSchema);
const Archive = mongoose.model('Archive', listSchema); // Using the same schema for Archive

module.exports = {
    List,
    Archive
};
