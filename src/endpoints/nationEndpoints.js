import express from "express";
import NationModel from "../models/nations.js";
import upload from "../middleware/upload.js";
import uploadToCloudinary from "../models/cloudinary.js";

const nationEndpoints = express.Router();

nationEndpoints.post("/:id", upload.single("nationMenu"), async (req, res) => {
  try {
    const data = await uploadToCloudinary(req.file.path, "Kandidat_menu");
    const savedMenu = await NationModel.updateOne(
      { id: req.params.id },
      {
        $set: {
          menuUrl: data.url,
          publicId: data.public_id,
        },
      }
    );
    res.status(200).send("nation meny uploaded with success");
  } catch (error) {
    res.status(400).send(error);
  }
});

nationEndpoints.get("/getNations", (req, res) => {
  NationModel.find({})
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
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
    .then((result) => console.log("hej"))
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

  var query = { id: req.params.id };

  req.newData.guestCount = nation.guestCount;
});

nationEndpoints.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { maxCapacity, guestChange, description, image, header } = req.body;

  if (!maxCapacity && !guestChange && !description && !image) {
    res.status(400).send({ error: "Something is missing. Try again! 🙁" });
  }

  // Retrieve the current guestCount value from the database
  NationModel.findById(id)
    .then((nation) => {
      if (!nation) {
        throw new Error("Nation not foundd 🙁");
      }

      const currentGuestCount = nation.guestCount || 0;
      let updateObj = {};

      if (maxCapacity) {
        updateObj.maxCapacity = maxCapacity;
      }

      if (description) {
        updateObj.description = description;
      }

      if (guestChange === "add") {
        if (currentGuestCount < (maxCapacity || Infinity)) {
          updateObj.$inc = { guestCount: 1 };
        }
      }

      if (guestChange === "remove") {
        if (currentGuestCount > 0) {
          updateObj.$inc = { guestCount: -1 };
        }
      }

      if (image) {
        updateObj.image = image;
      }

      if (header) {
        updateObj.header = header;
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
    })
    .catch((err) => {
      res.status(404).send({ error: err.message });
    });
});

export default nationEndpoints;
