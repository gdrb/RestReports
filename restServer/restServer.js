//import { DbConexionProvider } from "./src/DbConexionProvider/DbConexionProvider2.services.js";

import express from "express";
// Define "require"
import { createRequire } from "module";
const require = createRequire(import.meta.url);

//const db = new DbConexionProvider();

const app = express();
import pollosDonJuanRouter from "../src/routes/pollosDonJuan/pollosDonJuanController/pollosDonJuanController.js";
//import { frigorifico } from "./src/restControllers/pollosdonjuan/controller.js";

app.use("/pollosdonjuan", pollosDonJuanRouter);

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.listen(3000);
