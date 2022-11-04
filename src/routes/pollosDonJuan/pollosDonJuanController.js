import express from "express";
const router = express.Router();

import { DbConexionProvider } from "../../DbConexionProvider/DbConexionProvider.services.js";

const db = new DbConexionProvider();

router.get("/1", async (req, res) => {
  console.log(`Param inicio: ${req.query.inicio}`);
  console.log(`Param fin: ${req.query.fin}`);
  let filter = {
    $and: [
      { "datos.processDateTime": { $gte: `${req.query.inicio}` } },
      { "datos.processDateTime": { $lte: `${req.query.fin}` } },
    ],
  };
  console.log(`filter: ${JSON.stringify(filter)}`);
  let conexionStatus = await db.getConexionStatus();
  if (!conexionStatus.result) {
    res.json(conexionStatus);
  }
  let data = await db.find("eventsBe", filter, {});
  console.log(`pollosDonJuanController => data: ${JSON.stringify(data)}`);
  res.json(data);
});

export default router;
