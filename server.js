const Express = require("express");
const path = require("path");
var cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
var category = require("./category");
var product = require("./products");
const config = require("./config");

const port = process.env.port | 5000;

const app = new Express();

app.use(cors());

app.use("/categories", category);
app.use("/products", product);

/*app.get("/", (req, res) => {
  res.send("Welcome to The Products Ltd.");
  res.end();
}); */

/***** start server when DB connection is done *****/
async function startServer() {
  await config.connectToDB();
  app.locals.db = mongoose.connection;
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

startServer();
