import express from "express";
//const express = require("express");
import NationModel from "../models/nations.js";
//const NationModel = require("../models/nations.js");
const nationEndpoints = express.Router();

nationEndpoints.get("/getNations", (req, res) => {
  //req = get info from frontend, res = send info from backend

  NationModel.find({})
    .then((err, result) => {
      console.log("getresult", result);
      res.json("result", result);
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
  const { maxCapacity, guestCount, description } = req.body;

  if (!maxCapacity && !guestCount && !description) {
    res
      .status(400)
      .send({ error: "maxCapacity, guestCount or description missing 🙁" });
  }

  let updateObj = {};
  if (maxCapacity) {
    updateObj.maxCapacity = maxCapacity;
  }

  if (description) {
    updateObj.description = description;
  }

  if (guestCount) {
    updateObj.$inc = { guestCount: 1 };
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
