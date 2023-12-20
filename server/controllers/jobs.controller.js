//Imports
const Jobs = require("../models/jobs.model");
//function used to get All Jobs in the DB including Archived
exports.allJobs = async function (req, res) {
  try {
    const allJobs = await Jobs.find({});
    res.json(allJobs);
  } catch (error) {
    throw error;
  }
};
//function used to get all Jobs that are not archived
exports.availableJobs = async (req, res) => {
  try {
    const availableJobs = await Jobs.find({ archived: { $ne: true } });
    res.send(availableJobs);
  } catch (error) {
    throw error;
  }
};
//function used to add a new job to the Db
exports.addNewJob = async (req, res) => {
  //Store a new job details in the JobSchema Model
  let jobModel = new Jobs({
    description: req.body.description,
    location: req.body.location,
    priority: req.body.priority,
    status: req.body.status,
    archived: false,
  });
  //Save the Jobs details into the database
  jobModel.save().then(function (job) {
    res.send("A new Job has been added to the Database Successfully");
  })
  .catch(function (error) {
    res
      .status(500)
      .send({ message: "An error occurred while Adding the Job" });
  });
};
//function used to edit/update existing job/jobs
exports.updateJob = async (req, res) => {
  try {
    const IDs = { _id: req.body.id };
    const change = {
      description: req.body.description,
      location: req.body.location,
      priority: req.body.priority,
      status: req.body.status,
      archived: false,
    };
    const update = await Jobs.findOneAndUpdate(IDs, change, {
      new: true,
    });
    res.send("Updated Successfully");
  } catch (error) {
    res.send({ message: "Error occurred while Updating job ", error });
  }
};
//function used to Archive an existing job
exports.archiveJob = async (req, res) => {
  try {
    const IDs = { _id: req.body.id };
    const change = {
      archived: true,
    };
    const update = await Jobs.findOneAndUpdate(IDs, change, {
      new: true,
    });
    res.send("Updated Successfully");
  } catch (error) {
    res.send({ message: "Error occurred while Updating job ", error });
  }
};


