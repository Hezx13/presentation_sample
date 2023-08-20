const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    id: String,
    text: String,
});

const listSchema = new mongoose.Schema({
    id: String,
    text: String,
    tasks: [taskSchema], // Embed the taskSchema within the listSchema
});

module.exports = mongoose.model('List', listSchema);
