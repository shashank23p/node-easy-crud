/* This is app file to create structure of express app 
actual use of node-easy-crud package can be found in routes/crud.js file */

const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv/config");
//routes
const crudRoute = require("./routes/crud");
//middleweres
app.use("/api/crud", crudRoute);
if (!process.env.DB_CONNECTION) {
  return console.error(
    "Please provide mongoDB connection string in envoirment variable DB_CONNECTION"
  );
}
//connect to mongoDB
mongoose.connect(
  process.env.DB_CONNECTION, // connection string should be provided in env var DB_CONNECTION
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to mongo");
    //starting express server
    app.listen(5000, () => {
      console.log("listning on port 5000");
    });
  }
);
