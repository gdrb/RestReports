import { DataBase } from "../db/db.services.js";

import {
  FUNCTIONS_NAMES,
  FUNCTION_LOG_LEVEL,
  LOG_LEVES,
  CLASS_NAME,
} from "./DbConexionProvider.logger.config.js";

// Define "require"
import { createRequire } from "module";
const require = createRequire(import.meta.url);
var colors = require("colors");

export class DbConexionProvider {
  constructor() {
    if (FUNCTION_LOG_LEVEL.CONSTRUCTOR >= LOG_LEVES.BASIC) {
      console.log(`${CLASS_NAME} ${FUNCTIONS_NAMES.CONSTRUCTOR}: Start`.cyan);
    }
    this.DbInstance = new DataBase("1", "Test2");

    const testInterval = setInterval(() => this.testVariables(), 5000);

    this.start();

    if (FUNCTION_LOG_LEVEL.CONSTRUCTOR >= LOG_LEVES.BASIC) {
      console.log(
        `${CLASS_NAME} ${FUNCTIONS_NAMES.CONSTRUCTOR}: Finished`.cyan
      );
    }
  }

  componentWillUnmount() {
    clearInterval(testInterval);
  }

  start = async () => {
    try {
      if (FUNCTION_LOG_LEVEL.START >= LOG_LEVES.BASIC) {
        console.log(`${CLASS_NAME} ${FUNCTIONS_NAMES.START}: Start`.cyan);
      }
      let startResult = await this.DbInstance.start();

      if (FUNCTION_LOG_LEVEL.START >= LOG_LEVES.BASIC) {
        console.log(`${CLASS_NAME} ${FUNCTIONS_NAMES.START}: Finished`.cyan);
      }
    } catch (e) {}
  };

  getConexionStatus = async () => {
    return this.DbInstance.getConexionStatus();
  };

  getConexionInstance = async () => {
    return this.DbInstance;
  };

  testVariables = async () => {
    if (FUNCTION_LOG_LEVEL.TEST_INTERVAL >= LOG_LEVES.VARIABLES) {
      console.log(`${CLASS_NAME} ${FUNCTIONS_NAMES.TEST_INTERVAL}: Start`.cyan);
    }

    if (FUNCTION_LOG_LEVEL.TEST_INTERVAL >= LOG_LEVES.VARIABLES) {
      console.log(
        `${CLASS_NAME} ${
          FUNCTIONS_NAMES.TEST_INTERVAL
        }: Db Conexion Status ${await (
          await this.DbInstance.getConexionStatus()
        ).response}`
      );
    }

    if (FUNCTION_LOG_LEVEL.TEST_INTERVAL >= LOG_LEVES.VARIABLES) {
      console.log(
        `${CLASS_NAME} ${FUNCTIONS_NAMES.TEST_INTERVAL}: Finished`.cyan
      );
    }
  };
}
