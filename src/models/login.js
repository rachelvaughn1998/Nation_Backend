import mongoose from "mongoose";

const url =
  "mongodb+srv://oliviahogstedt:89WWYRRv0iQKFj4G@cluster0.kfs5n4j.mongodb.net/Kandidat?retryWrites=true&w=majority";
mongoose.connect(url).then(() => {
  console.log("connected");
});

const LogInSchema = new mongoose.Schema({
  nationID: {
    type: Number,
    required: true,
  },

  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
});

LogInSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const LogInModel = mongoose.model("login", LogInSchema);
export default LogInModel;
