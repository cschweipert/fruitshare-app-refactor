// jshint esversion:6
const express = require("express");
const routes = require("./routes")
const bodyParser = require("body-parser");
const axios = require("axios")
// const request = require("request");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/fruitshareDB", {
  useNewUrlParser: true
})
  .then(() => {
    console.log("connected to database")
  })
  .catch(err => {
    console.log(err)
  })

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use("", routes);

app.use(express.static("public"));

app.listen(3000, function () {
  console.log("Server started on port 3000.");
});
