var express = require("express");
var cors = require("cors");
var app = express();
var bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

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
    const robotid = Number(req.params.id);
    await client.connect();
    console.log("Node connected successfully to GET-id MongoDB");
    const query = { id: robotid };
    const results = await db.collection("cart").findOne(query);
    console.log("Results :", results);
    if (!results) res.send("Not Found").status(404);
    else res.send(results).status(200);
  });

app.listen(port, () => {
  console.log("App listening at http://%s:%s", host, port);
});
