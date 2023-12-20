//Imports
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jobController  = require("./controllers/jobs.controller");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const PORT = 8080;
require("dotenv").config();
//Uses
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
//server Listening
app.listen(PORT, function () {
  console.log(`Server listening on port ${PORT}!`);
});
//Database config
mongoose.connect('mongodb+srv://admin:admin123@capstonecluster.xb8ltuz.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", function () {
  console.log("Connected to the database");
});
mongoose.connection.on("error", function () {
  console.log("Connection to Mongo established.");
  console.log("Could not connect to the database");
  process.exit();
});
//Main Routes
app.get("/", (req, res) => {
  res.send("Main Route");
});
//Route Used to get All Jobs
app.get("/allJobs", jobController.allJobs);
//Route Used to get All Jobs that are not Archived
app.get("/availableJobs", jobController.availableJobs);
//Route Used to Add a new Job to the Database
app.post("/addNewJob", jobController.addNewJob);
//Route Used to Update a Job in the Database
app.put("/updateJob", jobController.updateJob);
//Route Used to Archive a Job in the Database
app.put("/archiveJob", jobController.archiveJob);
