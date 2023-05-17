import mongoose from "mongoose";
//const mongoose = require("mongoose");

const url =
  "mongodb+srv://oliviahogstedt:89WWYRRv0iQKFj4G@cluster0.kfs5n4j.mongodb.net/Kandidat?retryWrites=true&w=majority";
mongoose.connect(url).then(() => {}); //connect to database

const NationSchema = new mongoose.Schema({
  nationID: {
    type: Number,
    required: true,
  },

  username: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: false,
  },

  description: {
    type: String,
    required: true,
  },

  maxCapacity: {
    type: Number,
    required: false,
  },

  guestCount: {
    type: Number,
    required: false,
  },

  openingHours: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
    match: /^https?:\/\/.*$/i,
  },
  header: {
    type: String,
    required: false,
    match: /^https?:\/\/.*$/i,
  },
  publicId: {
    type: String,
  },

  menuUrl: {
    type: String,
    required: false,
  },
});

NationSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const NationModel = mongoose.model("nations", NationSchema);
export default NationModel;
