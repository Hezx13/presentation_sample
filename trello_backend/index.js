var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var body_parser_1 = __importDefault(require("body-parser"));
const db = require('./database'); // Import the database connection
const List = require('./models/list'); // Import the List model

var app = express_1.default();

app.use(cors_1.default());
app.use(body_parser_1.default.json());

var port = 4000;

var lists = [
    {
      id: "0",
      text: "To Do",
      tasks: [{ id: "c0", text: "Generate app scaffold" }]
    },
    {
      id: "1",
      text: "In Progress",
      tasks: [{ id: "c2", text: "Learn Typescript" }]
    },
    {
      id: "2",
      text: "Done",
      tasks: [{ id: "c3", text: "Begin to use static typing" }]
    }
];

app.post("/save", async function (req, res) {
    try {
        const newLists = req.body.lists;
        lists = newLists;
        await List.deleteMany(); // Delete existing documents
        await List.insertMany(newLists); // Insert new documents
        return res.json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to save lists.' });
    }
});

app.get("/load", async function (req, res) {
    try {
        const loadedLists = await List.find();
        return res.json({ lists: loadedLists });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to load lists.' });
    }
});

app.delete('/list/:listId/task/:taskId', async (req, res) => {
    try {
        const listId = req.params.listId;
        const taskId = req.params.taskId;

        const result = await List.findOneAndUpdate(
            { id: listId },
            { $pull: { tasks: { id: taskId } } },
            { new: true } // Return the updated document
            );

        if (!result) {
            return res.status(404).send({ error: 'List or task not found' });
        }

        res.send({ message: 'Task deleted successfully', result });
    } catch (error) {
        res.status(500).send({ error: 'Server error' });
    }
});

app.listen(port, function () {
    return console.log("Kanban backend running on http://localhost:" + port + "!");
});
