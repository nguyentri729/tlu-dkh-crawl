require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const tluRouter = require("./routers/tlu.router");
const mongoose = require("mongoose");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use("/tlu", tluRouter);

app.get("/", (req, res) => {
    console.log(process.env.TZ)
});
mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function() {
   
  }
);
var server = app.listen(process.env.PORT || 8080, function() {
  console.log("Running in Port: ", server.address().port);
});