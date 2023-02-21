import express from "express";
const router = express.Router();

import { DbConexionProvider } from "../../../DbConexionProvider/DbConexionProvider.services.js";

import {
  CLASS_NAME,
  FUNCTIONS_NAMES,
  FUNCTION_LOG_LEVEL,
  LOG_LEVES,
} from "./client1Controller.logger.config.js";

import { getReport } from "../client1Reports/GetReport.js";

const db = new DbConexionProvider();

// find all reports defined for a client
router.get("/reports", async (req, res) => {
  try {
    if (FUNCTION_LOG_LEVEL.REPORTS >= LOG_LEVES.BASIC) {
      console.log(`${CLASS_NAME} ${FUNCTIONS_NAMES.REPORTS} Start`.cyan);
    }

    if (FUNCTION_LOG_LEVEL.REPORTS >= LOG_LEVES.VARIABLES) {
      console.log(
        `${CLASS_NAME} ${FUNCTIONS_NAMES.REPORTS} Received userId: ${req.query.userId}`
      );
    }

    let filter = {
      $and: [{ propietarios: `${req.query.userId}` }],
    };

    if (FUNCTION_LOG_LEVEL.REPORTS >= LOG_LEVES.VARIABLES) {
      console.log(
        `${CLASS_NAME} ${FUNCTIONS_NAMES.REPORTS} Filter: ${JSON.stringify(
          filter
        )}`
      );
    }

    if (FUNCTION_LOG_LEVEL.REPORTS >= LOG_LEVES.DETAILED) {
      console.log(
        `${CLASS_NAME} ${FUNCTIONS_NAMES.REPORTS} Verifying Database Conexion`
          .yellow
      );
    }

    let data = await db.find("reports", {}, {});

    for (let i = 0; i < data.response.length; i++) {
      delete data.response[i].propietarios;
    }

    if (FUNCTION_LOG_LEVEL.REPORTS >= LOG_LEVES.VARIABLES) {
      console.log(
        `${CLASS_NAME} ${
          FUNCTIONS_NAMES.REPORTS
        } Retrieved Data: ${JSON.stringify(data, null, 2)}`
      );
    }

    if (!data.result) {
      let response = [];
      res.json(response);
      console.log(`${CLASS_NAME} ${FUNCTIONS_NAMES.REPORTS} Error: DB error`);
      if (FUNCTION_LOG_LEVEL.REPORTS >= LOG_LEVES.BASIC) {
        console.log(`${CLASS_NAME} ${FUNCTIONS_NAMES.REPORTS} Finished`.cyan);
      }
      return {
        result: false,
      };
    }

    if (data.response.length == 0) {
      let response = [];

      res.json(response);
      if (FUNCTION_LOG_LEVEL.REPORTS >= LOG_LEVES.BASIC) {
        console.log(`${CLASS_NAME} ${FUNCTIONS_NAMES.REPORTS} Finished`.cyan);
      }
      return {
        result: true,
      };
    }

    res.json(data);

    if (FUNCTION_LOG_LEVEL.REPORTS >= LOG_LEVES.BASIC) {
      console.log(`${CLASS_NAME} ${FUNCTIONS_NAMES.REPORTS} Finished`.cyan);
    }
  } catch (e) {
    console.log(
      `${CLASS_NAME} ${FUNCTIONS_NAMES.REPORTS} Error: DB error: ${e}`
    );
  }
});

// find data from a defined report
router.get("/events", async (req, res) => {
  let response = (await getReport(req.query, db)).response;
  return res.json(response);
});

export default router;
