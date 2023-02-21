import express from "express";
const router = express.Router();

import { DbConexionProvider } from "../../../DbConexionProvider/DbConexionProvider.services.js";
import {
  getMaxTemp,
  getMaxValue,
  getMinTemp,
  getMinValue,
  getLastTemp,
  getLastValue,
  retrieveTempValueTimeArray,
  retrieveValueTimeArray,
} from "../sensors/tempHelpers/tempHelpers.js";

import {
  CLASS_NAME,
  FUNCTIONS_NAMES,
  FUNCTION_LOG_LEVEL,
  LOG_LEVES,
} from "./pollosDonJuanController.logger.config.js";
import { getFilter } from "../sensors/filters/filters.js";

import moment from "moment/moment.js";
import { getReport } from "../Reports/GetReport.js";

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
  } catch (e) {}
});

router.get("/events", async (req, res) => {
  let response = (await getReport(req.query, db)).response;
  return res.json(response);

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

  if (FUNCTION_LOG_LEVEL.EVENTS >= LOG_LEVES.DETAILED) {
    console.log(
      `${CLASS_NAME} ${FUNCTIONS_NAMES.EVENTS} Creating filter from received data`
        .yellow
    );
  }

  /*let filter = {
    $and: [
      { "datos.idFromTh": { $eq: `${req.query.id}` } },
      { "datos.idToTh": { $eq: `${req.query.id}` } },
      { "datos.type": `tempChange` },
      { "datos.processDateTime": { $gte: `${req.query.inicio}` } },
      { "datos.processDateTime": { $lte: `${req.query.fin}` } },
      //{ "datos.processDateTime": { $gte: new Date(`${req.query.inicio}`) } },
      //{ "datos.processDateTime": { $lte: new Date(`${req.query.fin}`) } },
    ],
  };*/

  let filterResponse = getFilter(req.query);
  let filter = filterResponse.result ? filterResponse.response : null;

  if (FUNCTION_LOG_LEVEL.EVENTS >= LOG_LEVES.VARIABLES) {
    console.log(
      `${CLASS_NAME} ${FUNCTIONS_NAMES.EVENTS} Filter: ${JSON.stringify(
        filter,
        null,
        2
      )}`
    );
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
    return {
      result: false,
      error: `${CLASS_NAME} ${FUNCTIONS_NAMES.EVENTS} Error: DB Disconnected`
        .red,
    };
  }

  if (FUNCTION_LOG_LEVEL.EVENTS >= LOG_LEVES.DETAILED) {
    console.log(
      `${CLASS_NAME} ${FUNCTIONS_NAMES.EVENTS} Connected to Database`.yellow
    );
  }

  if (FUNCTION_LOG_LEVEL.EVENTS >= LOG_LEVES.DETAILED) {
    console.log(
      `${CLASS_NAME} ${FUNCTIONS_NAMES.EVENTS} Retrieving Data from Database`
        .yellow
    );
  }

  let data = filter ? await db.find("eventsBe", filter, {}) : null;

  if (FUNCTION_LOG_LEVEL.EVENTS >= LOG_LEVES.VARIABLES) {
    console.log(
      `${CLASS_NAME} ${FUNCTIONS_NAMES.EVENTS} Retrieved Data: ${JSON.stringify(
        data,
        null,
        2
      )}`
    );
  }

  if (FUNCTION_LOG_LEVEL.EVENTS >= LOG_LEVES.DETAILED) {
    console.log(
      `${CLASS_NAME} ${FUNCTIONS_NAMES.EVENTS} Creating result data`.yellow
    );
  }

  if (!data.result) {
    let response = {
      maxValue: ``,
      minValue: ``,
      lastValue: ``,
      valueValueDateTimeArray: [],
      /*maxTemp: ``,
      minTemp: ``,
      lastTemp: ``,
      tempValueDateTimeArray: [],*/
    };
    res.json(response);
    console.log(`${CLASS_NAME} ${FUNCTIONS_NAMES.EVENTS} Error: DB error`);
    if (FUNCTION_LOG_LEVEL.EVENTS >= LOG_LEVES.BASIC) {
      console.log(`${CLASS_NAME} ${FUNCTIONS_NAMES.EVENTS} Finished`.cyan);
    }
    return {
      result: false,
    };
  }

  if (FUNCTION_LOG_LEVEL.EVENTS >= LOG_LEVES.DETAILED) {
    console.log(
      `${CLASS_NAME} ${FUNCTIONS_NAMES.EVENTS} Converting UTC to locale`.yellow
    );
  }

  if (FUNCTION_LOG_LEVEL.EVENTS >= LOG_LEVES.VARIABLES) {
    console.log(
      `${CLASS_NAME} ${FUNCTIONS_NAMES.EVENTS} Retrieved data length ${data.response.length}`
    );
  }

  for (let i = 0; i < data.response.length; i++) {
    data.response[i].datos.processDateTime = moment(
      data.response[i].datos.processDateTime
    )
      .local()
      .format();
  }

  if (FUNCTION_LOG_LEVEL.EVENTS >= 4 /*LOG_LEVES.VARIABLES*/) {
    console.log(
      `${CLASS_NAME} ${FUNCTIONS_NAMES.EVENTS} Retrieved Data: ${JSON.stringify(
        data,
        null,
        2
      )}`
    );
  }

  if (data.response.length == 0) {
    let response = {
      result: true,
      response: {
        maxValue: ``,
        minValue: ``,
        lastValue: ``,
        valueDateTimeArray: [],
        /*maxTemp: ``,
        minTemp: ``,
        lastTemp: ``,
        tempValueDateTimeArray: [],*/
      },
    };
    res.json(response);
    if (FUNCTION_LOG_LEVEL.EVENTS >= LOG_LEVES.BASIC) {
      console.log(`${CLASS_NAME} ${FUNCTIONS_NAMES.EVENTS} Finished`.cyan);
    }
    return {
      result: true,
    };
  }

  // Retrieving Temp Value dateTime Array
  //let tempValueTimeArrayResponse = retrieveTempValueTimeArray(data.response);
  let tempValueTimeArrayResponse = retrieveValueTimeArray(
    req.query.type,
    data.response
  );

  if (FUNCTION_LOG_LEVEL.EVENTS >= LOG_LEVES.VARIABLES) {
    console.log(
      `${CLASS_NAME} ${FUNCTIONS_NAMES.EVENTS} Retrieved Data: ${JSON.stringify(
        tempValueTimeArrayResponse
      )}`
    );
  }

  if (!tempValueTimeArrayResponse.result) {
  }

  if (tempValueTimeArrayResponse.response.length == 0) {
  }

  // Retrieving Max. Temp.
  let maxTemp = getMaxValue(tempValueTimeArrayResponse.response);
  if (FUNCTION_LOG_LEVEL.EVENTS >= LOG_LEVES.VARIABLES) {
    console.log(`${CLASS_NAME} ${FUNCTIONS_NAMES.EVENTS} Max Temp: ${maxTemp}`);
  }

  // Retrieving Min. Temp.
  let minTemp = getMinValue(tempValueTimeArrayResponse.response);
  if (FUNCTION_LOG_LEVEL.EVENTS >= LOG_LEVES.VARIABLES) {
    console.log(`${CLASS_NAME} ${FUNCTIONS_NAMES.EVENTS} Min Temp: ${minTemp}`);
  }

  // Retrieving Last Temp.
  let lastTemp = getLastValue(tempValueTimeArrayResponse.response);
  if (FUNCTION_LOG_LEVEL.EVENTS >= LOG_LEVES.VARIABLES) {
    console.log(
      `${CLASS_NAME} ${FUNCTIONS_NAMES.EVENTS} Min Temp: ${lastTemp}`
    );
  }

  let responseData = {
    result: true,
    response: {
      maxTemp: maxTemp,
      minTemp: minTemp,
      lastTemp: lastTemp,
      tempValueDateTimeArray: tempValueTimeArrayResponse.response,
    },
  };

  res.json(responseData);
  if (FUNCTION_LOG_LEVEL.EVENTS >= LOG_LEVES.BASIC) {
    console.log(`${CLASS_NAME} ${FUNCTIONS_NAMES.EVENTS} Finished`.cyan);
  }
});

export default router;
