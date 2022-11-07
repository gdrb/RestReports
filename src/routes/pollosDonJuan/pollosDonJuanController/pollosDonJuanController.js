import express from "express";
const router = express.Router();

import { DbConexionProvider } from "../../../DbConexionProvider/DbConexionProvider.services.js";
import {
  getMaxTemp,
  retrieveTempValueTimeArray,
} from "../tempHelpers/tempHelpers.js";
import {
  CLASS_NAME,
  FUNCTIONS_NAMES,
  FUNCTION_LOG_LEVEL,
  LOG_LEVES,
} from "./pollosDonJuanController.logger.config.js";

import colors from "colors";

const db = new DbConexionProvider();

router.get("/events", async (req, res) => {
  if (FUNCTION_LOG_LEVEL.EVENTS >= LOG_LEVES.BASIC) {
    console.log(`${CLASS_NAME} ${FUNCTIONS_NAMES.EVENTS} Start`.cyan);
  }
  if (FUNCTION_LOG_LEVEL.EVENTS >= LOG_LEVES.VARIABLES) {
    console.log(
      `${CLASS_NAME} ${FUNCTIONS_NAMES.EVENTS} Received id: ${req.query.id}`
    );
    console.log(
      `${CLASS_NAME} ${FUNCTIONS_NAMES.EVENTS} Received inicio: ${req.query.inicio}`
    );
    console.log(
      `${CLASS_NAME} ${FUNCTIONS_NAMES.EVENTS} Received fin: ${req.query.fin}`
    );
  }

  let filter = {
    $and: [
      { "datos.processDateTime": { $gte: `${req.query.inicio}` } },
      { "datos.processDateTime": { $lte: `${req.query.fin}` } },
    ],
  };

  if (FUNCTION_LOG_LEVEL.EVENTS >= LOG_LEVES.VARIABLES) {
    console.log(`${CLASS_NAME} ${FUNCTIONS_NAMES.EVENTS} Filter: ${filter}`);
  }

  if (FUNCTION_LOG_LEVEL.EVENTS >= LOG_LEVES.DETAILED) {
    console.log(
      `${CLASS_NAME} ${FUNCTIONS_NAMES.EVENTS} Verifying Database Conexion`
        .yellow
    );
  }

  let conexionStatus = await db.getConexionStatus();

  if (FUNCTION_LOG_LEVEL.EVENTS >= LOG_LEVES.VARIABLES) {
    console.log(
      `${CLASS_NAME} ${
        FUNCTIONS_NAMES.EVENTS
      } DB Conexion Status: ${JSON.stringify(conexionStatus)}`
    );
  }
  if (!conexionStatus.result) {
    res.json(conexionStatus);
    if (FUNCTION_LOG_LEVEL.EVENTS >= LOG_LEVES.BASIC) {
      console.log(`${CLASS_NAME} ${FUNCTIONS_NAMES.EVENTS} Finished`.cyan);
    }
  }

  if (FUNCTION_LOG_LEVEL.EVENTS >= LOG_LEVES.DETAILED) {
    console.log(
      `${CLASS_NAME} ${FUNCTIONS_NAMES.EVENTS} Retrieving Data from Database`
        .yellow
    );
  }

  let data = await db.find("eventsBe", filter, {});

  if (FUNCTION_LOG_LEVEL.EVENTS >= LOG_LEVES.VARIABLES) {
    console.log(
      `${CLASS_NAME} ${FUNCTIONS_NAMES.EVENTS} Retrived Data: ${JSON.stringify(
        data
      )}`
    );
  }

  let tempValueTimeArrayResponse = retrieveTempValueTimeArray(data.response);

  if (FUNCTION_LOG_LEVEL.EVENTS >= LOG_LEVES.VARIABLES) {
    console.log(
      `${CLASS_NAME} ${FUNCTIONS_NAMES.EVENTS} Retrived Data: ${JSON.stringify(
        tempValueTimeArrayResponse
      )}`
    );
  }

  let maxTemp = getMaxTemp(tempValueTimeArrayResponse.response);

  if (FUNCTION_LOG_LEVEL.EVENTS >= LOG_LEVES.VARIABLES) {
    console.log(`${CLASS_NAME} ${FUNCTIONS_NAMES.EVENTS} Max Temp: ${maxTemp}`);
  }

  res.json(data);
  if (FUNCTION_LOG_LEVEL.EVENTS >= LOG_LEVES.BASIC) {
    console.log(`${CLASS_NAME} ${FUNCTIONS_NAMES.EVENTS} Finished`.cyan);
  }
});

export default router;
