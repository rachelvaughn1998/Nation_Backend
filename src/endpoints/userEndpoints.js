import express from "express";
import LogInModel from "../models/login.js";
const userEndpoints = express.Router();

userEndpoints.get("/getLogin", (req, res) => {
  LogInModel.find({})
    .then((err, result) => {
      if (err) {
        res.json(err);
      } else {
        res.json(result);
      }
    })
    .catch((err) => {
      res.status(400).send({ error: "Could not find account 🙁" });
    });
});

userEndpoints.post("/createLogin", (req, res) => {
  const login = req.body;
  if (login.username === undefined || login.password === undefined) {
    res.status(400).send({ error: "Username or password missing 🙁" });
  }
  const newLogin = new LogInModel(login);
  newLogin
    .save()
    .then((result) => console.log("result", result))
    .catch((err) => {
      res.status(400).send({ error: "Could not create account 🙁" });
    });

  res.json(login);
});

userEndpoints.get("/:id", (req, res) => {
  LogInModel.findById(req.params.id)
    .then((login) => res.json(login))
    .catch((err) => {
      res.status(400).send({ error: "Could not find account 🙁" });
    });
});

userEndpoints.post("/:id", (req, res) => {
  const login = req.body;
  var query = { id: req.params.id };
});

userEndpoints.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { username, password, email } = req.body;

  if (!username && !password && !email) {
    res.status(400).send({ error: "Something is missing 🙁" });
  }

  let updateObj = {};
  if (username) {
    updateObj.username = username;
  }

  if (password) {
    updateObj.password = password;
  }

  if (email) {
    updateObj.email = email;
  }

  LogInModel.findByIdAndUpdate(id, updateObj, { new: true })
    .then((updatedLogin) => {
      if (!updatedLogin) {
        res.status(404).send({ error: "Account not found 🙁" });
      } else {
        res.json(updatedLogin);
      }
    })
    .catch((err) => {
      res.status(400).send({ error: "Could not update account 🙁" });
    });
});

export default userEndpoints;
