import { DATABASE_ERRORS, DB_CONEXION_STATES } from "./db.constants.js";
import { MongoDBServices } from "./mongodb/mongodb.services.js";
import { Logger } from "../logger/logger.services.js";

import {
  LOGGER_FUNCTIONS,
  LOGGER_FUNCTION_LOG_LEVEL,
  LOGGER_LOG_LEVES,
} from "./db.logger.config.js";

// Define "require"
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { type } from "os";
const require = createRequire(import.meta.url);
const path = require("path");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dotenv = require("dotenv").config({
  path: require("find-config")(".env"),
});
const dBNameInEnv = process.env.NOMBRE_BASE_DE_DATOS;
const ipBaseDeDatos = process.env.IP_BASE_DE_DATOS;
const puertoBaseDeDatos = process.env.PUERTO_BASE_DE_DATOS;
const ipBaseDeDatosReplica = process.env.IP_BASE_DE_DATOS_REPLICA;
const puertoBaseDeDatosReplica = process.env.PUERTO_BASE_DE_DATOS_REPLICA;
const protocoloBaseDeDatos = process.env.PROTOCOLO_BASE_DE_DATOS;
const opcionesConexionBaseDeDatos = process.env.OPCIONES_CONEXION_BASE_DE_DATOS;

export class DataBase {
  constructor(id, dbName) {
    this.LOGGER_NAME = "DB.SERVICES ";
    this.LOGGER_NAME = this.LOGGER_NAME + `[${id}] => `;

    LOGGER_FUNCTION_LOG_LEVEL.CONSTRUCTOR >= LOGGER_LOG_LEVES.BASIC
      ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.CONSTRUCTOR).info(
          "Start"
        )
      : false;

    LOGGER_FUNCTION_LOG_LEVEL.CONSTRUCTOR >= LOGGER_LOG_LEVES.VARIABLES
      ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.CONSTRUCTOR).info(
          `Received Id: ${id} - Received dbName: ${dbName}`
        )
      : false;

    this.id = id;
    this.dbName = dBNameInEnv;

    if (typeof dbName != "undefined") {
      this.dbName = dbName;
    }

    this.dbUrl =
      protocoloBaseDeDatos +
      "://" +
      ipBaseDeDatos +
      ":" +
      puertoBaseDeDatos +
      "/" +
      this.dbName; /*+
      '?' +
      opcionesConexionBaseDeDatos;*/

    LOGGER_FUNCTION_LOG_LEVEL.CONSTRUCTOR >= LOGGER_LOG_LEVES.VARIABLES
      ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.CONSTRUCTOR).info(
          `this.dbName: ${this.dbName} - this.Url: ${this.dbUrl}`
        )
      : false;

    this.connecting = false;
    this.reconnectWatchDog = false;

    this.reconnectInterval = setInterval(() => {
      this.reconnect();
    }, 5000);

    // Only for testing
    this.stillAlive = setInterval(() => {
      LOGGER_FUNCTION_LOG_LEVEL.CONSTRUCTOR >= LOGGER_LOG_LEVES.VARIABLES
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.CONSTRUCTOR
          ).info(`stillAlive: ${this.stillAlive}`)
        : false;
    }, 5000);

    LOGGER_FUNCTION_LOG_LEVEL.CONSTRUCTOR >= LOGGER_LOG_LEVES.BASIC
      ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.CONSTRUCTOR).info(
          "Finished"
        )
      : false;
  }

  start = async () => {
    try {
      LOGGER_FUNCTION_LOG_LEVEL.START >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.START).info(
            "Start"
          )
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.START >= LOGGER_LOG_LEVES.VARIABLES
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.START).info(
            `Received URL: ${this.dbUrl} - Received dbName: ${this.dbName}`
          )
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.START >= LOGGER_LOG_LEVES.VARIABLES
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.START).info(
            `URL: ${this.dbUrl} - dbName: ${this.dbName}`
          )
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.START >= LOGGER_LOG_LEVES.DETAILED
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.START).info(
            "Verifying Conexion Status"
          )
        : false;

      let getConexionStatusResult = await this.getConexionStatus();

      LOGGER_FUNCTION_LOG_LEVEL.START >= LOGGER_LOG_LEVES.VARIABLES
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.START).info(
            "getConexionStatusResult: " +
              JSON.stringify(getConexionStatusResult)
          )
        : false;

      if (getConexionStatusResult.response == DB_CONEXION_STATES.CONNECTED) {
        LOGGER_FUNCTION_LOG_LEVEL.START >= LOGGER_LOG_LEVES.DETAILED
          ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.START).info(
              "Connected to Database"
            )
          : false;

        LOGGER_FUNCTION_LOG_LEVEL.START >= LOGGER_LOG_LEVES.BASIC
          ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.START).info(
              "Finished"
            )
          : false;

        return { result: true };
      }

      LOGGER_FUNCTION_LOG_LEVEL.START >= LOGGER_LOG_LEVES.DETAILED
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.START).info(
            "Connecting to Database"
          )
        : false;

      this.reconnectWatchDog = true; // Set connexion monitor on for reconnexion if disconnexion

      let connectResult = await this.connect();

      LOGGER_FUNCTION_LOG_LEVEL.START >= LOGGER_LOG_LEVES.VARIABLES
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.START).info(
            "ConnectResult: " + JSON.stringify(connectResult)
          )
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.START >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.START).info(
            "Finished"
          )
        : false;

      return connectResult ? { result: true } : { result: false };
    } catch (e) {
      LOGGER_FUNCTION_LOG_LEVEL.START >= LOGGER_LOG_LEVES.ERRORS
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.START).error(
            DATABASE_ERRORS.ERROR_STARTING_DATABASE +
              ": " +
              this.dbName +
              "\n" +
              e
          )
        : false;

      return { result: false, error: DATABASE_ERRORS.DISCONNECTION_ERROR };
    }
  };

  stop = async () => {
    try {
      LOGGER_FUNCTION_LOG_LEVEL.STOP >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.STOP).info(
            "Start"
          )
        : false;

      let getConexionStatusResult = this.getConexionStatus();

      if (
        getConexionStatusResult.result &&
        getConexionStatusResult.response == DB_CONEXION_STATES.DISCONNECTED
      ) {
        LOGGER_FUNCTION_LOG_LEVEL.STOP >= LOGGER_LOG_LEVES.VARIABLES
          ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.STOP).info(
              `getConexion result: ${getConexionStatusResult.result} /n Conexion Status: ${getConexionStatusResult.response}`
            )
          : false;

        LOGGER_FUNCTION_LOG_LEVEL.STOP >= LOGGER_LOG_LEVES.BASIC
          ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.STOP).info(
              "Finished"
            )
          : false;
        return { result: true };
      }
      LOGGER_FUNCTION_LOG_LEVEL.STOP >= LOGGER_LOG_LEVES.DETAILED
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.STOP).info(
            "Disconnecting from Database"
          )
        : false;

      let disconnectResult = await this.disconnect();

      LOGGER_FUNCTION_LOG_LEVEL.STOP >= LOGGER_LOG_LEVES.VARIABLES
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.STOP).info(
            JSON.stringify(disconnectResult)
          )
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.STOP >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.STOP).info(
            "Finished"
          )
        : false;

      return disconnectResult ? { result: true } : { result: false };
    } catch (e) {
      LOGGER_FUNCTION_LOG_LEVEL.STOP >= LOGGER_LOG_LEVES.ERRORS
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.STOP).error(
            DATABASE_ERRORS.ERROR_STOPPING_DATABASE +
              ": " +
              this.dbName +
              "\n" +
              e
          )
        : false;

      return { result: false, error: DATABASE_ERRORS.DISCONNECTION_ERROR };
    }
  };

  getConexionStatus = async () => {
    try {
      LOGGER_FUNCTION_LOG_LEVEL.GET_CONEXION_STATUS >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.GET_CONEXION_STATUS
          ).info("Start")
        : false;

      this.conexionStatusMongoDb = this.mongoDbServices.getConexionStatus();

      LOGGER_FUNCTION_LOG_LEVEL.GET_CONEXION_STATUS >=
      LOGGER_LOG_LEVES.VARIABLES
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.GET_CONEXION_STATUS
          ).info(
            `this.mongodb.getConexionStatus(): ${JSON.stringify(
              this.conexionStatusMongoDb
            )}`
          )
        : false;

      if (this.conexionStatusMongoDb === DB_CONEXION_STATES.CONNECTED) {
        LOGGER_FUNCTION_LOG_LEVEL.GET_CONEXION_STATUS >=
        LOGGER_LOG_LEVES.DETAILED
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.GET_CONEXION_STATUS
            ).info("MongoDb Services are available")
          : false;

        LOGGER_FUNCTION_LOG_LEVEL.GET_CONEXION_STATUS >= LOGGER_LOG_LEVES.BASIC
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.GET_CONEXION_STATUS
            ).info("Finished")
          : false;

        return {
          result: true,
          response: this.conexionStatusMongoDb,
        };
      }

      LOGGER_FUNCTION_LOG_LEVEL.GET_CONEXION_STATUS >= LOGGER_LOG_LEVES.DETAILED
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.GET_CONEXION_STATUS
          ).error(`MongoDb Services are unavailable`)
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.GET_CONEXION_STATUS >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.GET_CONEXION_STATUS
          ).info("Finished")
        : false;

      return {
        result: false,
        response: this.conexionStatusMongoDb,
      };
    } catch (e) {
      LOGGER_FUNCTION_LOG_LEVEL.GET_CONEXION_STATUS >= LOGGER_LOG_LEVES.ERRORS
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.GET_CONEXION_STATUS
          ).error(
            DATABASE_ERRORS.ERROR_GETTING_CONEXION_STATUS +
              ". DATABASE NAME: " +
              this.dbName +
              "\n" +
              e
          )
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.GET_CONEXION_STATUS >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.GET_CONEXION_STATUS
          ).info("Finished")
        : false;

      return {
        result: false,
        error: DATABASE_ERRORS.ERROR_GETTING_CONEXION_STATUS,
      };
    }
  };

  connect = async () => {
    try {
      LOGGER_FUNCTION_LOG_LEVEL.CONNECT >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.CONNECT).info(
            "Start"
          )
        : false;

      this.mongoDbServices = new MongoDBServices(
        this.dbUrl,
        this.dbName,
        this.id
      );

      LOGGER_FUNCTION_LOG_LEVEL.CONNECT >= LOGGER_LOG_LEVES.DETAILED
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.CONNECT).info(
            "Connecting to Database"
          )
        : false;

      this.connecting = true;

      let connectResult = await this.mongoDbServices.connect();

      this.connecting = false;

      LOGGER_FUNCTION_LOG_LEVEL.CONNECT >= LOGGER_LOG_LEVES.VARIABLES
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.CONNECT).info(
            `ConnectResult: ${JSON.stringify(connectResult)}`
          )
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.CONNECT >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.CONNECT).info(
            "Finished"
          )
        : false;
      return true;
    } catch (e) {
      LOGGER_FUNCTION_LOG_LEVEL.CONNECT >= LOGGER_LOG_LEVES.ERRORS
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.CONNECT).error(
            DATABASE_ERRORS.ERROR_CONNECTING_TO_DATABASE +
              ": " +
              this.dbName +
              "\n" +
              e
          )
        : false;
      return false;
    }
  };

  disconnect = async () => {
    try {
      LOGGER_FUNCTION_LOG_LEVEL.DISCONNECT >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.DISCONNECT).info(
            "Start"
          )
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.DISCONNECT >= LOGGER_LOG_LEVES.DETAILED
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.DISCONNECT).info(
            "Disconnecting from Database"
          )
        : false;

      let disconnectResult = await this.mongoDbServices.disconnect();

      LOGGER_FUNCTION_LOG_LEVEL.DISCONNECT >= LOGGER_LOG_LEVES.VARIABLES
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.DISCONNECT).info(
            `DisconnectResult: ${JSON.stringify(disconnectResult)}`
          )
        : false;

      clearInterval(this.stillAlive);

      LOGGER_FUNCTION_LOG_LEVEL.DISCONNECT >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.DISCONNECT).info(
            "Finished"
          )
        : false;
      return true;
    } catch (e) {
      LOGGER_FUNCTION_LOG_LEVEL.DISCONNECT >= LOGGER_LOG_LEVES.ERRORS
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.DISCONNECT
          ).error(
            DATABASE_ERRORS.ERROR_DISCONNECTING_FROM_DATABASE +
              ": " +
              this.dbName +
              "\n" +
              e
          )
        : false;
      return false;
    }
  };

  reconnect = async () => {
    try {
      LOGGER_FUNCTION_LOG_LEVEL.CONNECT >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.RECONNECT).info(
            "Start"
          )
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.CONNECT >= LOGGER_LOG_LEVES.VARIABLES
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.RECONNECT).info(
            `this.reconnectWatchDog: ${this.reconnectWatchDog} - ` +
              `this.connecting: ${this.connecting}`
          )
        : false;

      if (this.reconnectWatchDog) {
        if (!this.connecting) {
          if (
            (await this.getConexionStatus()).response ===
            DB_CONEXION_STATES.DISCONNECTED
          ) {
            // Try to reconnect
            LOGGER_FUNCTION_LOG_LEVEL.CONNECT >= LOGGER_LOG_LEVES.BASIC
              ? Logger.getLogger(
                  this.LOGGER_NAME + LOGGER_FUNCTIONS.RECONNECT
                ).info("Trying reconnexion")
              : false;
            await this.connect();
          }
        } else {
          LOGGER_FUNCTION_LOG_LEVEL.CONNECT >= LOGGER_LOG_LEVES.BASIC
            ? Logger.getLogger(
                this.LOGGER_NAME + LOGGER_FUNCTIONS.RECONNECT
              ).info("Waiting reponse for an already sent connection try")
            : false;
        }
      }
      LOGGER_FUNCTION_LOG_LEVEL.CONNECT >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.RECONNECT).info(
            "Finished"
          )
        : false;
    } catch (e) {}
  };

  insertUpdateOne = async (collection, query, data) => {
    try {
      LOGGER_FUNCTION_LOG_LEVEL.INSERT_UPDATE_ONE >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_UPDATE_ONE
          ).info("Start")
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.INSERT_UPDATE_ONE >= LOGGER_LOG_LEVES.VARIABLES
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_UPDATE_ONE
          ).info(
            `Received collection: ${JSON.stringify(collection)} \n` +
              `Received query: ${JSON.stringify(query)} \n` +
              `Received data: ${JSON.stringify(data)}`
          )
        : false;

      if (this.mongoDbServices) {
        LOGGER_FUNCTION_LOG_LEVEL.INSERT_UPDATE_ONE >= LOGGER_LOG_LEVES.DETAILED
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_UPDATE_ONE
            ).info("MongoDb Services are available")
          : false;

        let insertUpdateOneResult = await this.mongoDbServices.insertUpdateOne(
          collection,
          query,
          data
        );

        LOGGER_FUNCTION_LOG_LEVEL.INSERT_UPDATE_ONE >=
        LOGGER_LOG_LEVES.VARIABLES
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_UPDATE_ONE
            ).info(
              `insertUpdateOneResult: ${JSON.stringify(insertUpdateOneResult)}`
            )
          : false;

        LOGGER_FUNCTION_LOG_LEVEL.INSERT_UPDATE_ONE >=
        LOGGER_LOG_LEVES.VARIABLES
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_UPDATE_ONE
            ).info("Finished")
          : false;

        return {
          result: true,
          response: insertUpdateOneResult,
        };
      }

      LOGGER_FUNCTION_LOG_LEVEL.INSERT_UPDATE_ONE >= LOGGER_LOG_LEVES.DETAILED
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_UPDATE_ONE
          ).error("MongoDb Services are unavailable")
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.INSERT_UPDATE_ONE >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_UPDATE_ONE
          ).info("Finished")
        : false;

      return {
        result: false,
        error: `${
          this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_UPDATE_ONE
        } MongoDb Services are unavailable`,
      };
    } catch (e) {
      LOGGER_FUNCTION_LOG_LEVEL.INSERT_UPDATE_ONE >= LOGGER_LOG_LEVES.ERRORS
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_UPDATE_ONE
          ).error(
            DATABASE_ERRORS.ERROR_INSERTING_OR_UPDATING +
              ": " +
              this.dbName +
              "\n" +
              e
          )
        : false;

      return {
        result: false,
        error: DATABASE_ERRORS.ERROR_INSERTING_OR_UPDATING,
      };
    }
  };

  insertOne = async (collection, data) => {
    try {
      LOGGER_FUNCTION_LOG_LEVEL.INSERT_ONE >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_ONE).info(
            "Start"
          )
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.INSERT_ONE >= LOGGER_LOG_LEVES.VARIABLES
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_ONE).info(
            `Received collection: ${JSON.stringify(collection)} \n` +
              `Received data: ${JSON.stringify(data)}`
          )
        : false;

      if (this.mongoDbServices) {
        LOGGER_FUNCTION_LOG_LEVEL.INSERT_ONE >= LOGGER_LOG_LEVES.DETAILED
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_ONE
            ).info("MongoDb Services are available")
          : false;

        let insertOneResult = await this.mongoDbServices.insertOne(
          collection,
          data
        );

        LOGGER_FUNCTION_LOG_LEVEL.INSERT_ONE >= LOGGER_LOG_LEVES.VARIABLES
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_ONE
            ).info(`insertUpdateOneResult: ${JSON.stringify(insertOneResult)}`)
          : false;

        LOGGER_FUNCTION_LOG_LEVEL.INSERT_ONE >= LOGGER_LOG_LEVES.VARIABLES
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_ONE
            ).info("Finished")
          : false;

        return {
          result: true,
          response: insertOneResult,
        };
      }

      LOGGER_FUNCTION_LOG_LEVEL.INSERT_ONE >= LOGGER_LOG_LEVES.DETAILED
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_ONE
          ).error("MongoDb Services are unavailable")
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.INSERT_ONE >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_ONE).info(
            "Finished"
          )
        : false;

      return {
        result: false,
        error: `${
          LOGGER_FUNCTION_LOG_LEVEL.INSERT_ONE >= LOGGER_LOG_LEVES.BASIC
        } Mongodb Services are unavaliable`,
      };
    } catch (e) {
      LOGGER_FUNCTION_LOG_LEVEL.INSERT_ONE >= LOGGER_LOG_LEVES.ERRORS
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_ONE
          ).error(
            DATABASE_ERRORS.ERROR_INSERTING_ONE + ": " + this.dbName + "\n" + e
          )
        : false;

      return {
        result: false,
        error: DATABASE_ERRORS.ERROR_INSERTING_ONE,
      };
    }
  };

  insertMany = async (collection, dataArray) => {
    try {
      LOGGER_FUNCTION_LOG_LEVEL.INSERT_MANY >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_MANY
          ).info("Start")
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.INSERT_MANY >= LOGGER_LOG_LEVES.VARIABLES
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_MANY
          ).info(
            `Received collection: ${JSON.stringify(collection)} \n` +
              `Received data: ${JSON.stringify(dataArray)}`
          )
        : false;

      if (this.mongoDbServices) {
        LOGGER_FUNCTION_LOG_LEVEL.INSERT_MANY >= LOGGER_LOG_LEVES.DETAILED
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_MANY
            ).info("MongoDb Services are available")
          : false;

        let insertManyResult = await this.mongoDbServices.insertMany(
          collection,
          dataArray
        );

        LOGGER_FUNCTION_LOG_LEVEL.INSERT_MANY >= LOGGER_LOG_LEVES.VARIABLES
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_MANY
            ).info(`insertUpdateOneResult: ${JSON.stringify(insertManyResult)}`)
          : false;

        LOGGER_FUNCTION_LOG_LEVEL.INSERT_ONE >= LOGGER_LOG_LEVES.VARIABLES
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_MANY
            ).info("Finished")
          : false;

        return {
          result: true,
          response: insertManyResult,
        };
      }

      LOGGER_FUNCTION_LOG_LEVEL.INSERT_MANY >= LOGGER_LOG_LEVES.DETAILED
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_MANY
          ).error("MongoDb Services are unavailable")
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.INSERT_MANY >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_MANY
          ).info("Finished")
        : false;

      return { result: false, error: "Mongodb Services are unavaliable" };
    } catch (e) {
      LOGGER_FUNCTION_LOG_LEVEL.INSERT_ONE >= LOGGER_LOG_LEVES.ERRORS
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_ONE
          ).error(
            DATABASE_ERRORS.ERROR_INSERTING_ONE + ": " + this.dbName + "\n" + e
          )
        : false;

      return {
        result: false,
        error: DATABASE_ERRORS.ERROR_INSERTING_ONE,
      };
    }
  };

  updateOne = async (collection, query, data) => {
    try {
      LOGGER_FUNCTION_LOG_LEVEL.UPDATE_ONE >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.UPDATE_ONE).info(
            "Start"
          )
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.UPDATE_ONE >= LOGGER_LOG_LEVES.VARIABLES
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.UPDATE_ONE).info(
            `\nReceived collection: ${JSON.stringify(collection)} \n` +
              `Received query: ${JSON.stringify(query)} \n` +
              `Received data: ${JSON.stringify(data)}`
          )
        : false;

      if (this.mongoDbServices) {
        LOGGER_FUNCTION_LOG_LEVEL.UPDATE_ONE >= LOGGER_LOG_LEVES.DETAILED
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.UPDATE_ONE
            ).info("MongoDb Services are available")
          : false;

        let deleteOneResult = await this.mongoDbServices.updateOne(
          collection,
          query,
          data
        );

        LOGGER_FUNCTION_LOG_LEVEL.UPDATE_ONE >= LOGGER_LOG_LEVES.VARIABLES
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.UPDATE_ONE
            ).info(`insertUpdateOneResult: ${JSON.stringify(deleteOneResult)}`)
          : false;

        LOGGER_FUNCTION_LOG_LEVEL.UPDATE_ONE >= LOGGER_LOG_LEVES.VARIABLES
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.UPDATE_ONE
            ).info("Finished")
          : false;

        return {
          result: true,
          response: deleteOneResult,
        };
      }

      LOGGER_FUNCTION_LOG_LEVEL.UPDATE_ONE >= LOGGER_LOG_LEVES.DETAILED
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.UPDATE_ONE
          ).error("MongoDb Services are unavailable")
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.UPDATE_ONE >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.UPDATE_ONE).info(
            "Finished"
          )
        : false;

      return { result: false, error: "Mongodb Services are unavaliable" };
    } catch (e) {
      LOGGER_FUNCTION_LOG_LEVEL.UPDATE_ONE >= LOGGER_LOG_LEVES.ERRORS
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.UPDATE_ONE
          ).error(
            DATABASE_ERRORS.ERROR_UPDATING_ONE + ": " + this.dbName + "\n" + e
          )
        : false;

      return {
        result: false,
        error: DATABASE_ERRORS.ERROR_UPDATING_ONE,
      };
    }
  };

  updateMany = async (collection, query, dataArray) => {
    try {
      LOGGER_FUNCTION_LOG_LEVEL.UPDATE_MANY >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.UPDATE_MANY
          ).info("Start")
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.UPDATE_MANY >= LOGGER_LOG_LEVES.VARIABLES
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.UPDATE_MANY
          ).info(
            `Received collection: ${JSON.stringify(collection)} \n` +
              `Received query: ${JSON.stringify(query)} \n` +
              `Received dataArray: ${JSON.stringify(dataArray)}`
          )
        : false;

      if (this.mongoDbServices) {
        LOGGER_FUNCTION_LOG_LEVEL.UPDATE_MANY >= LOGGER_LOG_LEVES.DETAILED
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.UPDATE_MANY
            ).info("MongoDb Services are available")
          : false;

        let deleteManyResult = await this.mongoDbServices.updateMany(
          collection,
          query,
          dataArray
        );

        LOGGER_FUNCTION_LOG_LEVEL.UPDATE_MANY >= LOGGER_LOG_LEVES.VARIABLES
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.UPDATE_MANY
            ).info(`insertUpdateOneResult: ${JSON.stringify(deleteManyResult)}`)
          : false;

        LOGGER_FUNCTION_LOG_LEVEL.UPDATE_ONE >= LOGGER_LOG_LEVES.VARIABLES
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.UPDATE_MANY
            ).info("Finished")
          : false;

        return {
          result: true,
          response: deleteManyResult,
        };
      }

      LOGGER_FUNCTION_LOG_LEVEL.UPDATE_MANY >= LOGGER_LOG_LEVES.DETAILED
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.UPDATE_MANY
          ).error("MongoDb Services are unavailable")
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.UPDATE_MANY >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.UPDATE_MANY
          ).info("Finished")
        : false;

      return { result: false, error: "Mongodb Services are unavaliable" };
    } catch (e) {
      LOGGER_FUNCTION_LOG_LEVEL.UPDATE_ONE >= LOGGER_LOG_LEVES.ERRORS
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.UPDATE_MANY
          ).error(
            DATABASE_ERRORS.ERROR_UPDATING_MANY + ": " + this.dbName + "\n" + e
          )
        : false;

      return {
        result: false,
        error: DATABASE_ERRORS.ERROR_UPDATING_MANY,
      };
    }
  };

  deleteOne = async (collection, query) => {
    try {
      LOGGER_FUNCTION_LOG_LEVEL.DELETE_ONE >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.DELETE_ONE).info(
            "Start"
          )
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.UPDATE_ONE >= LOGGER_LOG_LEVES.VARIABLES
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.DELETE_ONE).info(
            `Received collection: ${JSON.stringify(collection)} \n` +
              `Received query: ${JSON.stringify(query)}`
          )
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.DELETE_ONE >= LOGGER_LOG_LEVES.DETAILED
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.DELETE_ONE).info(
            "MongoDb Services are unavailable"
          )
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.DELETE_ONE >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.DELETE_ONE).info(
            "Finished"
          )
        : false;

      if (this.mongoDbServices) {
        LOGGER_FUNCTION_LOG_LEVEL.DELETE_ONE >= LOGGER_LOG_LEVES.DETAILED
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.DELETE_ONE
            ).info("MongoDb Services are available")
          : false;

        let deleteOneResult = await this.mongoDbServices.deleteOne(
          collection,
          query
        );

        LOGGER_FUNCTION_LOG_LEVEL.DELETE_ONE >= LOGGER_LOG_LEVES.VARIABLES
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.DELETE_ONE
            ).info(`insertUpdateOneResult: ${JSON.stringify(deleteOneResult)}`)
          : false;

        LOGGER_FUNCTION_LOG_LEVEL.DELETE_ONE >= LOGGER_LOG_LEVES.VARIABLES
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.DELETE_ONE
            ).info("Finished")
          : false;

        return {
          result: true,
          response: deleteOneResult,
        };
      }

      LOGGER_FUNCTION_LOG_LEVEL.DELETE_ONE >= LOGGER_LOG_LEVES.DETAILED
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.DELETE_ONE
          ).error("MongoDb Services are unavailable")
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.DELETE_ONE >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.DELETE_ONE).info(
            "Finished"
          )
        : false;

      return { result: false, error: "Mongodb Services are unavaliable" };
    } catch (e) {
      LOGGER_FUNCTION_LOG_LEVEL.DELETE_ONE >= LOGGER_LOG_LEVES.ERRORS
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.DELETE_ONE
          ).error(
            DATABASE_ERRORS.ERROR_DELETING_ONE + ": " + this.dbName + "\n" + e
          )
        : false;

      return {
        result: false,
        error: DATABASE_ERRORS.ERROR_DELETING_ONE,
      };
    }
  };

  deleteMany = async (collection, query) => {
    try {
      LOGGER_FUNCTION_LOG_LEVEL.UPDATE_MANY >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.UPDATE_MANY
          ).info("Start")
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.UPDATE_MANY >= LOGGER_LOG_LEVES.VARIABLES
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.UPDATE_MANY
          ).info(
            `Received collection: ${JSON.stringify(collection)} \n` +
              `Received query: ${JSON.stringify(query)}`
          )
        : false;

      if (this.mongoDbServices) {
        LOGGER_FUNCTION_LOG_LEVEL.DELETE_MANY >= LOGGER_LOG_LEVES.DETAILED
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.DELETE_MANY
            ).info("MongoDb Services are available")
          : false;

        let deleteManyResult = await this.mongoDbServices.deleteMany(
          collection,
          query
        );

        LOGGER_FUNCTION_LOG_LEVEL.DELETE_MANY >= LOGGER_LOG_LEVES.VARIABLES
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.DELETE_MANY
            ).info(`insertUpdateOneResult: ${JSON.stringify(deleteManyResult)}`)
          : false;

        LOGGER_FUNCTION_LOG_LEVEL.DELETE_ONE >= LOGGER_LOG_LEVES.VARIABLES
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.DELETE_MANY
            ).info("Finished")
          : false;

        return {
          result: true,
          response: deleteManyResult,
        };
      }

      LOGGER_FUNCTION_LOG_LEVEL.DELETE_ONE >= LOGGER_LOG_LEVES.DETAILED
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.DELETE_ONE
          ).error("MongoDb Services are unavailable")
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.DELETE_MANY >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.DELETE_MANY
          ).info("Finished")
        : false;

      return { result: false, error: "Mongodb Services are unavaliable" };
    } catch (e) {
      LOGGER_FUNCTION_LOG_LEVEL.DELETE_MANY >= LOGGER_LOG_LEVES.ERRORS
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.DELETE_MANY
          ).error(
            DATABASE_ERRORS.ERROR_DELETING_MANY + ": " + this.dbName + "\n" + e
          )
        : false;

      return {
        result: false,
        error: DATABASE_ERRORS.ERROR_DELETING_MANY,
      };
    }
  };

  find = async (collection, query, projection) => {
    try {
      LOGGER_FUNCTION_LOG_LEVEL.FIND >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.FIND).info(
            "Start"
          )
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.FIND >= LOGGER_LOG_LEVES.VARIABLES
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.FIND).info(
            `Received collection: ${JSON.stringify(collection)} \n` +
              `Received query: ${JSON.stringify(query, null, 2)} \n` +
              `Received projection: ${JSON.stringify(projection)}`
          )
        : false;

      if (!collection) {
        LOGGER_FUNCTION_LOG_LEVEL.FIND >= LOGGER_LOG_LEVES.ERRORS
          ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.FIND).error(
              DATABASE_ERRORS.COLLECTION_UNDEFINED
            )
          : false;

        LOGGER_FUNCTION_LOG_LEVEL.FIND >= LOGGER_LOG_LEVES.VARIABLES
          ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.FIND).info(
              `Received collection: ${JSON.stringify(collection)} \n` +
                `Received query: ${JSON.stringify(query)}`
            )
          : false;

        return { result: false, error: DATABASE_ERRORS.COLLECTION_UNDEFINED };
      }

      if (
        (await this.getConexionStatus()).response ===
        DB_CONEXION_STATES.CONNECTED
      ) {
        LOGGER_FUNCTION_LOG_LEVEL.FIND >= LOGGER_LOG_LEVES.DETAILED
          ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.FIND).error(
              "MongoDb Services are available"
            )
          : false;

        let findResult = await this.mongoDbServices.find(collection, query, {});

        LOGGER_FUNCTION_LOG_LEVEL.FIND >= LOGGER_LOG_LEVES.DETAILED
          ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.FIND).info(
              `findResult: ${JSON.stringify(findResult)}`
            )
          : false;

        LOGGER_FUNCTION_LOG_LEVEL.FIND >= LOGGER_LOG_LEVES.DETAILED
          ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.FIND).info(
              `Found ${findResult.response.length} in Database: ${this.dbName}`
            )
          : false;

        findResult.response.map((found, index) => {
          LOGGER_FUNCTION_LOG_LEVEL.FIND >= LOGGER_LOG_LEVES.VARIABLES
            ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.FIND).info(
                `findResult[${index}]: ${JSON.stringify(found)} \n`
              )
            : false;
        });

        LOGGER_FUNCTION_LOG_LEVEL.FIND >= LOGGER_LOG_LEVES.VARIABLES
          ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.FIND).info(
              "Finished"
            )
          : false;

        return {
          result: true,
          response: findResult.response,
        };
      }

      LOGGER_FUNCTION_LOG_LEVEL.FIND >= LOGGER_LOG_LEVES.DETAILED
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.FIND).error(
            "MongoDb Services are unavailable"
          )
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.FIND >= LOGGER_LOG_LEVES.VARIABLES
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.FIND).info(
            "Finished"
          )
        : false;

      return { result: false, error: "Mongodb Services are unavaliable" };
    } catch (e) {
      LOGGER_FUNCTION_LOG_LEVEL.FIND >= LOGGER_LOG_LEVES.ERRORS
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.FIND).error(
            DATABASE_ERRORS.ERROR_SEARCHING_IN_DATABASE +
              ": " +
              this.dbName +
              "\n" +
              e
          )
        : false;
      this.conexionStatusMongoDb = this.mongoDbServices.getConexionStatus();
      return {
        result: false,
        error: DATABASE_ERRORS.ERROR_SEARCHING_IN_DATABASE,
      };
    }
  };
}

//export const DataBaseInstance = new DataBase();
