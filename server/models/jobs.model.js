//Imports
const mongoose = require("mongoose");
//Jobs schema
const JobSchema = mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    required: false,
    default: "Low",
  },
  status: {
    type: String,
    required: false,
    default: "submitted",
  },
  archived: {
    type: Boolean,
    required: false,
    default: false,
  },
  createdAt: {
    type: Date,
    required: false,
    default: Date.now,
  }
});
//Export Job Model
const JobsModel = mongoose.model("Jobs", JobSchema);
module.exports = JobsModel;