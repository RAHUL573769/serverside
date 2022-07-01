const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const cors = require("cors");

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
  ObjectID,
} = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iuaz1.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// client.connect((err) => {
//   const todoCollection = client.db("endgame-assignment").collection("todo");
// });

async function run() {
  try {
    await client.connect();
    const todoCollection = client.db("endgame-assignment").collection("todo");

    app.post("/todo", async (req, res) => {
      const newTodo = req.body;
      console.log(newTodo);
      const resultTodo = await todoCollection.insertOne(newTodo);

      res.send(resultTodo);
    });
    app.delete("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: ObjectId(id),
      };

      const result = await todoCollection.deleteOne(query);
      res.send(result);
    });
    app.put("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;

      const filter = {
        _id: ObjectId(id),
      };

      const options = { upsert: true };

      const updatedDoc = {
        $set: {
          name: updatedUser.name,
          day: updatedUser.day,
        },
      };

      const result = await todoCollection.updateOne(
        filter,
        updatedDoc,
        options
      );

      res.send(result);
    });
    app.get("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectID(id) };
      const result = await todoCollection.findOne(query);
      res.send(result);
    });
    app.get("/todo", async (req, res) => {
      const query = {};
      const cursor = todoCollection.find(query);
      const todoFinal = await cursor.toArray();
      res.send(todoFinal);
    });
  } finally {
  }
}

run().catch(console.dir);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
