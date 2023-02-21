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
import client1Router from "../src/routes/client1/client1Controller/client1Controller.js";
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use("/client1", cors(), client1Router);

app.listen(PORT, async function () {
  console.log("Reports server listening on port: ", PORT);
});
