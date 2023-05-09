import express from "express";
import NationModel from "../models/nations.js";
const nationEndpoints = express.Router();

nationEndpoints.get("/getNations", (req, res) => {
  NationModel.find({})
    .then((result) => {
      console.log("getresult", result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log("error", err);
      res.status(400).send({ error: "Could not get nations 🙁" });
    });
});

nationEndpoints.post("/createNations", (req, res) => {
  const nation = req.body;
  if (nation.name === undefined || nation.description === undefined) {
    res.status(400).send({ error: "Name or description missing 🙁" });
  }
  const newNation = new NationModel(nation);
  newNation
    .save()
    .then((result) => console.log("result", result))
    .catch((err) => {
      res.status(400).send({ error: "Could not create nations 🙁" });
    });

  res.json(nation);
});

nationEndpoints.get("/:id", (req, res) => {
  NationModel.findById(req.params.id)
    .then((nation) => res.json(nation))
    .catch((err) => {
      res.status(400).send({ error: "Could not get nation 🙁" });
    });
});

nationEndpoints.post("/:id", (req, res) => {
  const nation = req.body;
  console.log("nation", nation);
  var query = { id: req.params.id };
  console.log("req.newData", req.newData);
  req.newData.guestCount = nation.guestCount;
});

nationEndpoints.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { maxCapacity, guestChange, description, image } = req.body;

  if (!maxCapacity && !guestChange && !description && !image) {
    res.status(400).send({ error: "Something is missing. Try again! 🙁" });
  }

  let updateObj = {};
  if (maxCapacity) {
    updateObj.maxCapacity = maxCapacity;
  }

  if (description) {
    updateObj.description = description;
  }

  if (guestChange === "add") {
    updateObj.$inc = { guestCount: 1 };
  }

  if (guestChange === "remove") {
    updateObj.$inc = { guestCount: -1 };
  }
  if (image) {
    updateObj.image = image;
  }

  NationModel.findByIdAndUpdate(id, updateObj, { new: true })
    .then((updatedNation) => {
      if (!updatedNation) {
        res.status(404).send({ error: "Nation not found 🙁" });
      } else {
        res.json(updatedNation);
      }
    })
    .catch((err) => {
      res.status(400).send({ error: "Could not update nation 🙁" });
    });
});

export default nationEndpoints;
