//import { DbConexionProvider } from "./src/DbConexionProvider/DbConexionProvider2.services.js";

import express from "express";
import cors from "cors";
// Define "require"
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const path = require("path");

const dotenv = require("dotenv").config({
  path: require("find-config")(".env"),
});

const PORT = process.env.SERVIDOR_REST_PORT;

//const db = new DbConexionProvider();

const app = express();
import pollosDonJuanRouter from "../src/routes/pollosDonJuan/pollosDonJuanController/pollosDonJuanController.js";
//import { frigorifico } from "./src/restControllers/pollosdonjuan/controller.js";

app.use(
  cors({
    origin: "http://example.com:6850",
  })
);

app.use("/pollosdonjuan", cors(), pollosDonJuanRouter);

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.listen(PORT, async function () {
  console.log("Servidor de ThingRest listening on port: ", PORT);
});
