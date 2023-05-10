import express from "express";
const app = express();
import cors from "cors";
import nationEndpoints from "./endpoints/nationEndpoints.js";

app.use(cors());
app.use(express.json());

// process.env.MONGODBURL;

const url =
  "mongodb+srv://oliviahogstedt:89WWYRRv0iQKFj4G@cluster0.kfs5n4j.mongodb.net/Kandidat?retryWrites=true&w=majority";

app.use("/nations", nationEndpoints);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {});
