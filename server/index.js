import Route from "./route/routes.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyparser from "body-parser";
import "dotenv/config";
import path from "path";
console.log(process.env.CMS_SECRETE_KEY);
const app = express();
app.use(bodyparser.json({ extended: true }));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());
const __dirname = path.resolve();
app.use("/", Route);

const port = process.env.PORT || 8008;
const URL =
  "mongodb+srv://pankaj:passpankaj@cluster0.3qirq.mongodb.net/MYPROJECT?retryWrites=true&w=majority";

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

mongoose
  .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`successfull on port ${port}`);
    });
  })
  .catch((error) => {
    console.log("error", error.message);
  });
