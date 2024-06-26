var express = require("express");
var cors = require("cors");
var app = express();
var bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const { ObjectId } = require('mongodb');

app.use(cors());
app.use(bodyParser.json());

const port = "8081";
const host = "localhost";

const url = "mongodb://127.0.0.1:27017";
const dbName = "secoms319";
const client = new MongoClient(url);
const db = client.db(dbName);

app.get("/cart", async (req, res) => {
  await client.connect();
  console.log("Node connected successfully to GET MongoDB");
  const query = {};
  const results = await db.collection("cart").find(query).limit(100).toArray();
  console.log(results);
  res.status(200);
  res.send(results);
});

app.get("/:id", async (req, res) => {
  const itemid = Number(req.params._id);
  await client.connect();
  console.log("Node connected successfully to GET-id MongoDB");
  const query = { _id: itemid };
  const results = await db.collection("cart").findOne(query);
  console.log("Results :", results);
  if (!results) res.send("Not Found").status(404);
  else res.send(results).status(200);
});

app.post("/addSandwich", async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).send({ error: "Bad request: No data provided." });
    }
    await client.connect();

    const collections = await db.listCollections({ name: "cart" }).toArray();
    if (collections.length === 0) {
      return res
        .status(404)
        .send({ error: "Not found: Collection does not exist." });
    }

    const newDocument = req.body;
    console.log(newDocument);

    const existingDoc = await db
      .collection("cart")
      .findOne({ _id: newDocument._id });
    if (existingDoc) {
      return res
        .status(409)
        .send({ error: "Conflict: A sandwich with this ID already exists." });
    }

    const results = await db.collection("cart").insertOne(newDocument);
    res.status(200);
    res.send(results);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send({ error: "An internal server error occurred" });
  }
});

app.put("/update/:id", async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid ID format" });
  }

  try {
    const query = { _id: new ObjectId(id) }; 
    const sandwichUpdated = await db.collection("cart").findOne(query);

    if (!sandwichUpdated) {
      return res.status(404).send({ message: "Sandwich not found" });
    }

    const updateData = req.body;

    const options = {};
    const result = await db.collection("cart").updateOne(query, { $set: updateData }, options);

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "Update failed: Sandwich not found" });
    }

    res.status(200).send({ message: "Sandwich updated successfully", updatedSandwich: updateData });
  } catch (error) {
    console.error("Error updating sandwich:", error);
    res.status(500).send({ error: "An internal server error occurred" });
  }
});

app.delete("/deleteSandwich/:id", async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid ID format" });
  }

  try {
    await client.connect();
    console.log("Sandwich to delete :", id);
    const query = { _id: new ObjectId(id) }; 

    const sandwichDeleted = await db.collection("cart").findOneAndDelete(query);

    if (sandwichDeleted.value) {
      return res.status(404).send({ message: "Sandwich not found" });
    }

    res.status(200).send({ message: "Sandwich deleted successfully", deletedSandwich: sandwichDeleted.value });
  } catch (error) {
    console.error("Error deleting sandwich:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});


app.listen(port, () => {
  console.log("App listening at http://%s:%s", host, port);
});
