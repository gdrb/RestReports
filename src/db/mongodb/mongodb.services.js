import { MongoClient } from "mongodb";
import Ajv from "ajv";

import {
  DATABASE_ERRORS,
  MONGO_DB_CONEXION_STATES,
} from "./mongodb.constants.js";

import {
  LOGGER_FUNCTIONS,
  LOGGER_FUNCTION_LOG_LEVEL,
  LOGGER_LOG_LEVES,
} from "./mongodb.logger.config.js";

import {
  validateArray,
  validateObject,
  validateString,
} from "./mongodb.interfaces.js";

import { Logger } from "../../logger/logger.services.js";

const ajv = new Ajv();

const className = "MongoDBServices";

export class MongoDBServices {
  constructor(dbUrl, dbName, id) {
    this.LOGGER_NAME = "MONGODB.SERVICES ";
    this.LOGGER_NAME = this.LOGGER_NAME + `[${id}] => `;

    LOGGER_FUNCTION_LOG_LEVEL.CONSTRUCTOR >= LOGGER_LOG_LEVES.BASIC
      ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.CONSTRUCTOR).info(
          "Start"
        )
      : false;

    LOGGER_FUNCTION_LOG_LEVEL.CONSTRUCTOR >= LOGGER_LOG_LEVES.VARIABLES
      ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.CONSTRUCTOR).info(
          `Received URL: ${dbUrl}\n` + `Received dbName: ${dbName}`
        )
      : false;

    this.dbUrl = dbUrl;
    this.conexionInstance = new MongoClient(this.dbUrl, {});
    this.mongoDbConexionState = MONGO_DB_CONEXION_STATES.DISCONNECTED;
    this.dbName = dbName;

    this.conexionInstance.on("connectionClosed", () => {
      LOGGER_FUNCTION_LOG_LEVEL.CONSTRUCTOR >= LOGGER_LOG_LEVES.DETAILED
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.CONSTRUCTOR
          ).error("Connection closed Event received")
        : false;
      this.mongoDbConexionState = MONGO_DB_CONEXION_STATES.DISCONNECTED;
    });

    LOGGER_FUNCTION_LOG_LEVEL.CONSTRUCTOR >= LOGGER_LOG_LEVES.BASIC
      ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.CONSTRUCTOR).info(
          "Finished"
        )
      : false;
  }

  connect = async () => {
    try {
      LOGGER_FUNCTION_LOG_LEVEL.CONNECT >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.CONNECT).info(
            "Start"
          )
        : false;

      this.mongoDbConexionState = MONGO_DB_CONEXION_STATES.DISCONNECTED;
      await this.conexionInstance.connect();
      this.mongoDbConexionState = MONGO_DB_CONEXION_STATES.CONNECTED;

      LOGGER_FUNCTION_LOG_LEVEL.CONNECT >= LOGGER_LOG_LEVES.VARIABLES
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.CONNECT).info(
            `Conexion Status: ${JSON.stringify(this.mongoDbConexionState)}`
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
            DATABASE_ERRORS.ERROR_CONNECTING + ": " + this.dbName + "\n" + e
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

      await this.conexionInstance.close();
      this.mongoDbConexionState = MONGO_DB_CONEXION_STATES.DISCONNECTED;

      LOGGER_FUNCTION_LOG_LEVEL.DISCONNECT >= LOGGER_LOG_LEVES.VARIABLES
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.DISCONNECT).info(
            `Conexion Status: ${JSON.stringify(this.mongoDbConexionState)}`
          )
        : false;

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
            DATABASE_ERRORS.ERROR_DISCONNECTING + ": " + this.dbName + "\n" + e
          )
        : false;

      return false;
    }
  };

  getConexionInstance = () => {
    LOGGER_FUNCTION_LOG_LEVEL.GET_CONEXION_INSTANCE >= LOGGER_LOG_LEVES.BASIC
      ? Logger.getLogger(
          this.LOGGER_NAME + LOGGER_FUNCTIONS.GET_CONEXION_INSTANCE
        ).info("Start")
      : false;

    LOGGER_FUNCTION_LOG_LEVEL.GET_CONEXION_INSTANCE >=
    LOGGER_LOG_LEVES.VARIABLES
      ? Logger.getLogger(
          this.LOGGER_NAME + LOGGER_FUNCTIONS.GET_CONEXION_INSTANCE
        ).info(`Conexion Instance: ${JSON.stringify(this.conexionInstance)}`)
      : false;

    LOGGER_FUNCTION_LOG_LEVEL.GET_CONEXION_INSTANCE >= LOGGER_LOG_LEVES.BASIC
      ? Logger.getLogger(
          this.LOGGER_NAME + LOGGER_FUNCTIONS.GET_CONEXION_INSTANCE
        ).info("Finished")
      : false;
    return this.conexionInstance;
  };

  getConexionStatus = () => {
    try {
      LOGGER_FUNCTION_LOG_LEVEL.GET_CONEXION_STATUS >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.GET_CONEXION_STATUS
          ).info("Start")
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.GET_CONEXION_STATUS >=
      LOGGER_LOG_LEVES.VARIABLES
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.GET_CONEXION_STATUS
          ).info(
            `Conexion Status: ${JSON.stringify(this.mongoDbConexionState)}`
          )
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.GET_CONEXION_STATUS >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.GET_CONEXION_STATUS
          ).info("Finished")
        : false;
      return this.mongoDbConexionState;
    } catch (e) {
      LOGGER_FUNCTION_LOG_LEVEL.GET_CONEXION_STATUS >= LOGGER_LOG_LEVES.ERRORS
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.GET_CONEXION_STATUS
          ).error(
            DATABASE_ERRORS.GET_CONEXION_STATUS + ": " + this.dbName + "\n" + e
          )
        : false;
      return {
        result: false,
        error: `${className}: getConexionStatus: Error ${e}`,
      };
    }
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

      if (!validateString(collection)) {
        LOGGER_FUNCTION_LOG_LEVEL.INSERT_UPDATE_ONE >= LOGGER_LOG_LEVES.ERRORS
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_UPDATE_ONE
            ).error(
              DATABASE_ERRORS.ERROR_SEACHING +
                `: ${this.dbName} \n` +
                `${className} => insertUpdateOne: Invalid Data Type: collection type is ${typeof collection}`
            )
          : false;
        return {
          result: false,
          error: `${className} => insertUpdateOne: Invalid Data Type: collection type is ${typeof collection}`,
        };
      }

      if (!validateObject(query)) {
        LOGGER_FUNCTION_LOG_LEVEL.INSERT_UPDATE_ONE >= LOGGER_LOG_LEVES.ERRORS
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_UPDATE_ONE
            ).error(
              DATABASE_ERRORS.ERROR_SEACHING +
                `: ${this.dbName} \n` +
                `${className} => insertUpdateOne: Invalid Data Type: query type is ${typeof query}`
            )
          : false;
        return {
          result: false,
          error: `${className} => insertUpdateOne: Invalid Data Type: query type is ${typeof query}`,
        };
      }

      if (typeof data == "undefined") {
        LOGGER_FUNCTION_LOG_LEVEL.INSERT_UPDATE_ONE >= LOGGER_LOG_LEVES.ERRORS
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_UPDATE_ONE
            ).error(
              DATABASE_ERRORS.ERROR_SEACHING +
                `: ${this.dbName} \n` +
                `${className} => insertUpdateOne: Invalid Data Type: data type is ${typeof data}`
            )
          : false;
        return {
          result: false,
          error: `${className} => insertUpdateOne: Invalid Data Type: data type is ${typeof data}`,
        };
      }

      let insertUndateResult = await this.conexionInstance
        .db(this.dbName)
        .collection(collection)
        .findOneAndUpdate(
          query,
          { $set: data },
          {
            upsert: true,
            returnDocument: "after",
          }
        );

      LOGGER_FUNCTION_LOG_LEVEL.INSERT_UPDATE_ONE >= LOGGER_LOG_LEVES.VARIABLES
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_UPDATE_ONE
          ).info(`insertUpdateResult: ${JSON.stringify(insertUndateResult)}`)
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.INSERT_UPDATE_ONE >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_UPDATE_ONE
          ).info("Finished")
        : false;
      return { result: true, response: insertUndateResult };
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
        error: `${className}: insertUpdateOne: Error ${e}`,
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
            `\nReceived collection: ${JSON.stringify(collection)} \n` +
              `Received data: ${JSON.stringify(data)}`
          )
        : false;

      if (!validateString(collection)) {
        LOGGER_FUNCTION_LOG_LEVEL.INSERT_ONE >= LOGGER_LOG_LEVES.ERRORS
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_ONE
            ).error(
              DATABASE_ERRORS.ERROR_INSERTING_ONE +
                `: ${this.dbName} \n` +
                `${className} => insertOne: Invalid Data Type: collection type is ${typeof collection}`
            )
          : false;
        return {
          result: false,
          error: `${className} => insertOne: Invalid Data Type: collection type is ${typeof collection}`,
        };
      }

      if (typeof data == "undefined") {
        LOGGER_FUNCTION_LOG_LEVEL.INSERT_ONE >= LOGGER_LOG_LEVES.ERRORS
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_ONE
            ).error(
              DATABASE_ERRORS.ERROR_INSERTING_ONE +
                `: ${this.dbName} \n` +
                `${className} => insertOne: Invalid Data Type: data type is ${typeof data}`
            )
          : false;
        return {
          result: false,
          error: `${className} => insertOne: Invalid Data Type: data type is ${typeof data}`,
        };
      }

      let insertOneResult = await this.conexionInstance
        .db(this.dbName)
        .collection(collection)
        .insertOne(data);

      LOGGER_FUNCTION_LOG_LEVEL.INSERT_ONE >= LOGGER_LOG_LEVES.VARIABLES
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_ONE).info(
            `insertOneResult: ${JSON.stringify(insertOneResult)}`
          )
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.INSERT_ONE >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_ONE).info(
            "Finished"
          )
        : false;
      return { result: true, response: insertOneResult };
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
        error: `${className}: insertOne: Error ${e}`,
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
            `\nReceived collection: ${JSON.stringify(collection)} \n` +
              `Received data: ${JSON.stringify(dataArray)}`
          )
        : false;

      if (!validateString(collection)) {
        LOGGER_FUNCTION_LOG_LEVEL.INSERT_MANY >= LOGGER_LOG_LEVES.ERRORS
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_MANY
            ).error(
              DATABASE_ERRORS.ERROR_INSERTING_MANY +
                `: ${this.dbName} \n` +
                `${className} => insertMany: Invalid Data Type: collection type is ${typeof collection}`
            )
          : false;
        return {
          result: false,
          error: `${className} => insertMany: Invalid Data Type: collection type is ${typeof collection}`,
        };
      }

      if (!validateArray(dataArray)) {
        LOGGER_FUNCTION_LOG_LEVEL.INSERT_MANY >= LOGGER_LOG_LEVES.ERRORS
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_MANY
            ).error(
              DATABASE_ERRORS.ERROR_INSERTING_MANY +
                `: ${this.dbName} \n` +
                `${className} => insertMany: Invalid Data Type: collection type is ${typeof dataArray}`
            )
          : false;
        return {
          result: false,
          error: `${className} => insertMany: Invalid Data Type: collection type is ${typeof dataArray}`,
        };
      }

      let insertManyResult = await this.conexionInstance
        .db(this.dbName)
        .collection(collection)
        .insertMany(dataArray);

      LOGGER_FUNCTION_LOG_LEVEL.INSERT_MANY >= LOGGER_LOG_LEVES.VARIABLES
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_MANY
          ).info(`insertManyResult: ${JSON.stringify(insertManyResult)}`)
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.INSERT_MANY >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_MANY
          ).info("Finished")
        : false;
      return { result: true, response: insertManyResult };
    } catch (e) {
      LOGGER_FUNCTION_LOG_LEVEL.INSERT_MANY >= LOGGER_LOG_LEVES.ERRORS
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.INSERT_MANY
          ).error(
            DATABASE_ERRORS.ERROR_INSERTING_MANY + ": " + this.dbName + "\n" + e
          )
        : false;
      return {
        result: false,
        error: `${className}: insertMany: Error ${e}`,
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

      if (!validateString(collection)) {
        LOGGER_FUNCTION_LOG_LEVEL.UPDATE_ONE >= LOGGER_LOG_LEVES.ERRORS
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.UPDATE_ONE
            ).error(
              DATABASE_ERRORS.ERROR_UPDATING_ONE +
                `: ${this.dbName} \n` +
                `${className} => updateOne: Invalid Data Type: collection type is ${typeof collection}`
            )
          : false;
        return {
          result: false,
          error: `${className} => updateOne: Invalid Data Type: collection type is ${typeof collection}`,
        };
      }

      if (!validateObject(query)) {
        LOGGER_FUNCTION_LOG_LEVEL.UPDATE_ONE >= LOGGER_LOG_LEVES.ERRORS
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.UPDATE_ONE
            ).error(
              DATABASE_ERRORS.ERROR_UPDATING_ONE +
                `: ${this.dbName} \n` +
                `${className} => updateOne: Invalid Data Type: query type is ${typeof query}`
            )
          : false;
        return {
          result: false,
          error: `${className} => updateOne: Invalid Data Type: query type is ${typeof query}`,
        };
      }

      if (typeof data == "undefined") {
        LOGGER_FUNCTION_LOG_LEVEL.UPDATE_ONE >= LOGGER_LOG_LEVES.ERRORS
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.UPDATE_ONE
            ).error(
              DATABASE_ERRORS.ERROR_UPDATING_ONE +
                `: ${this.dbName} \n` +
                `${className} => updateOne: Invalid Data Type: data type is ${typeof data}`
            )
          : false;
        return {
          result: false,
          error: `${className} => updateOne: Invalid Data Type: data type is ${typeof data}`,
        };
      }

      let updateOneResult = await this.conexionInstance
        .db(this.dbName)
        .collection(collection)
        .updateOne(query, data);

      LOGGER_FUNCTION_LOG_LEVEL.UPDATE_ONE >= LOGGER_LOG_LEVES.VARIABLES
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.UPDATE_ONE).info(
            `updateOneResult: ${JSON.stringify(updateOneResult)}`
          )
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.UPDATE_ONE >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.UPDATE_ONE).info(
            "Finished"
          )
        : false;

      return { result: true, response: updateOneResult };
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
        error: `${className}: updateOne: Error ${e}`,
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
            `\nReceived collection: ${JSON.stringify(collection)} \n` +
              `Received query: ${JSON.stringify(query)} \n` +
              `Received data: ${JSON.stringify(dataArray)}`
          )
        : false;

      if (!validateString(collection)) {
        LOGGER_FUNCTION_LOG_LEVEL.UPDATE_MANY >= LOGGER_LOG_LEVES.ERRORS
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.UPDATE_MANY
            ).error(
              DATABASE_ERRORS.ERROR_UPDATING_MANY +
                `: ${this.dbName} \n` +
                `${className} => updateMany: Invalid Data Type: collection type is ${typeof collection}`
            )
          : false;
        return {
          result: false,
          error: `${className} => updateMany: Invalid Data Type: collection type is ${typeof collection}`,
        };
      }

      if (!validateObject(query)) {
        LOGGER_FUNCTION_LOG_LEVEL.UPDATE_MANY >= LOGGER_LOG_LEVES.ERRORS
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.UPDATE_MANY
            ).error(
              DATABASE_ERRORS.ERROR_UPDATING_MANY +
                `: ${this.dbName} \n` +
                `${className} => updateMany: Invalid Data Type: query type is ${typeof query}`
            )
          : false;
        return {
          result: false,
          error: `${className} => updateMany: Invalid Data Type: query type is ${typeof query}`,
        };
      }

      if (typeof data == "undefined") {
        LOGGER_FUNCTION_LOG_LEVEL.UPDATE_MANY >= LOGGER_LOG_LEVES.ERRORS
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.UPDATE_MANY
            ).error(
              DATABASE_ERRORS.ERROR_UPDATING_MANY +
                `: ${this.dbName} \n` +
                `${className} => updateMany: Invalid Data Type: data type is ${typeof data}`
            )
          : false;
        return {
          result: false,
          error: `${className} => updateMany: Invalid Data Type: data type is ${typeof data}`,
        };
      }

      let insertManyResult = await this.conexionInstance
        .db(this.dbName)
        .collection(collection)
        .updateMany(query, dataArray);

      LOGGER_FUNCTION_LOG_LEVEL.UPDATE_MANY >= LOGGER_LOG_LEVES.VARIABLES
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.UPDATE_MANY
          ).info(`insertManyResult: ${JSON.stringify(insertManyResult)}`)
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.UPDATE_MANY >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.UPDATE_MANY
          ).info("Finished")
        : false;

      return { result: true, response: insertManyResult };
    } catch (e) {
      LOGGER_FUNCTION_LOG_LEVEL.UPDATE_MANY >= LOGGER_LOG_LEVES.ERRORS
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.UPDATE_MANY
          ).error(
            DATABASE_ERRORS.ERROR_UPDATING_MANY + ": " + this.dbName + "\n" + e
          )
        : false;
      return {
        result: false,
        error: `${className}: updateMany: Error ${e}`,
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

      LOGGER_FUNCTION_LOG_LEVEL.DELETE_ONE >= LOGGER_LOG_LEVES.VARIABLES
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.DELETE_ONE).info(
            `Received collection: ${JSON.stringify(collection)} \n` +
              `Received query: ${JSON.stringify(query)}`
          )
        : false;

      if (!validateString(collection)) {
        LOGGER_FUNCTION_LOG_LEVEL.DELETE_ONE >= LOGGER_LOG_LEVES.ERRORS
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.DELETE_ONE
            ).error(
              DATABASE_ERRORS.ERROR_DELETING_ONE +
                `: ${this.dbName} \n` +
                `${className} => deleteOne: Invalid Data Type: collection type is ${typeof collection}`
            )
          : false;
        return {
          result: false,
          error: `${className} => deleteOne: Invalid Data Type: collection type is ${typeof collection}`,
        };
      }

      if (!validateObject(query)) {
        LOGGER_FUNCTION_LOG_LEVEL.DELETE_ONE >= LOGGER_LOG_LEVES.ERRORS
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.DELETE_ONE
            ).error(
              DATABASE_ERRORS.ERROR_DELETING_ONE +
                `: ${this.dbName} \n` +
                `${className} => deleteOne: Invalid Data Type: query type is ${typeof query}`
            )
          : false;
        return {
          result: false,
          error: `${className} => deleteOne: Invalid Data Type: query type is ${typeof query}`,
        };
      }

      let deleteResult = await this.conexionInstance
        .db(this.dbName)
        .collection(collection)
        .deleteOne(query);

      LOGGER_FUNCTION_LOG_LEVEL.DELETE_ONE >= LOGGER_LOG_LEVES.VARIABLES
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.DELETE_ONE).info(
            `deleteResult: ${JSON.stringify(deleteResult)}`
          )
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.DELETE_ONE >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.DELETE_ONE).info(
            "Finished"
          )
        : false;

      return { result: true, response: deleteResult };
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
        error: `${className}: deleteOne: Error ${e}`,
      };
    }
  };

  deleteMany = async (collection, query) => {
    try {
      LOGGER_FUNCTION_LOG_LEVEL.DELETE_MANY >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.UPDATE_MANY
          ).info("Start")
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.DELETE_MANY >= LOGGER_LOG_LEVES.VARIABLES
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.UPDATE_MANY
          ).info(
            `Received collection: ${JSON.stringify(collection)} \n` +
              `Received query: ${JSON.stringify(query)}`
          )
        : false;

      if (!validateString(collection)) {
        LOGGER_FUNCTION_LOG_LEVEL.DELETE_MANY >= LOGGER_LOG_LEVES.ERRORS
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.DELETE_MANY
            ).error(
              DATABASE_ERRORS.ERROR_DELETING_MANY +
                `: ${this.dbName} \n` +
                `${className} => deleteMany: Invalid Data Type: collection type is ${typeof collection}`
            )
          : false;
        return {
          result: false,
          error: `${className} => deleteMany: Invalid Data Type: collection type is ${typeof collection}`,
        };
      }

      if (!validateObject(query)) {
        LOGGER_FUNCTION_LOG_LEVEL.DELETE_MANY >= LOGGER_LOG_LEVES.ERRORS
          ? Logger.getLogger(
              this.LOGGER_NAME + LOGGER_FUNCTIONS.DELETE_MANY
            ).error(
              DATABASE_ERRORS.ERROR_DELETING_MANY +
                `: ${this.dbName} \n` +
                `${className} => deleteMany: Invalid Data Type: query type is ${typeof query}`
            )
          : false;
        return {
          result: false,
          error: `${className} => deleteMany: Invalid Data Type: query type is ${typeof query}`,
        };
      }

      let deleteManyResult = await this.conexionInstance
        .db(this.dbName)
        .collection(collection)
        .deleteMany(query);

      LOGGER_FUNCTION_LOG_LEVEL.INSERT_MANY >= LOGGER_LOG_LEVES.VARIABLES
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.UPDATE_MANY
          ).info(
            `Received collection: ${JSON.stringify(collection)} \n` +
              `Received query: ${JSON.stringify(query)}`
          )
        : false;

      LOGGER_FUNCTION_LOG_LEVEL.DELETE_MANY >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.UPDATE_MANY
          ).info("Finished")
        : false;

      return { result: true, response: deleteManyResult };
    } catch (e) {
      LOGGER_FUNCTION_LOG_LEVEL.DELETE_MANY >= LOGGER_LOG_LEVES.ERRORS
        ? Logger.getLogger(
            this.LOGGER_NAME + LOGGER_FUNCTIONS.DELETE_MANY
          ).error(
            DATABASE_ERRORS.ERROR_DELETING_MANY + ": " + this.dbName + "\n" + e
          )
        : false;
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
            `\nReceived collection: ${JSON.stringify(collection)} \n` +
              `Received query: ${JSON.stringify(query, null, 2)} \n` +
              `Received projection: ${JSON.stringify(projection)}`
          )
        : false;

      console.dir(query, { depth: null });

      if (!validateString(collection)) {
        LOGGER_FUNCTION_LOG_LEVEL.FIND >= LOGGER_LOG_LEVES.ERRORS
          ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.FIND).error(
              DATABASE_ERRORS.ERROR_SEACHING +
                `: ${this.dbName} \n` +
                `${className} => find: Invalid Data Type: collection type is ${typeof collection}`
            )
          : false;
        return {
          result: false,
          error: `${className} => find: Invalid Data Type: collection type is ${typeof collection}`,
        };
      }

      if (!validateObject(query)) {
        LOGGER_FUNCTION_LOG_LEVEL.FIND >= LOGGER_LOG_LEVES.ERRORS
          ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.FIND).error(
              DATABASE_ERRORS.ERROR_SEACHING +
                `: ${this.dbName} \n` +
                `${className} => find: Invalid Data Type: query type is ${typeof query}`
            )
          : false;
        return {
          result: false,
          error: `${className} => find: Invalid Data Type: query type is ${typeof query}`,
        };
      }

      if (!validateObject(projection)) {
        LOGGER_FUNCTION_LOG_LEVEL.FIND >= LOGGER_LOG_LEVES.ERRORS
          ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.FIND).error(
              DATABASE_ERRORS.ERROR_SEACHING +
                `: ${this.dbName} \n` +
                `${className} => find: Invalid Data Type: projection type is ${typeof projection}`
            )
          : false;
        return {
          result: false,
          error: `${className} => find: Invalid Data Type: projection type is ${typeof projection}`,
        };
      }

      let findResult = await this.conexionInstance
        .db(this.dbName)
        .collection(collection)
        .find(query, projection)
        .limit(10)
        .sort({ _id: -1 })
        .toArray();

      LOGGER_FUNCTION_LOG_LEVEL.FIND >= LOGGER_LOG_LEVES.DETAILED
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.FIND).info(
            `Found ${findResult.length} in Database: ${this.dbName}`
          )
        : false;

      findResult.map((found) => {
        LOGGER_FUNCTION_LOG_LEVEL.FIND >= LOGGER_LOG_LEVES.VARIABLES
          ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.FIND).info(
              `findResult: ${JSON.stringify(found)}`
            )
          : false;
      });

      LOGGER_FUNCTION_LOG_LEVEL.FIND >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.FIND).info(
            "Finished"
          )
        : false;

      return { result: true, response: findResult };
    } catch (e) {
      LOGGER_FUNCTION_LOG_LEVEL.FIND >= LOGGER_LOG_LEVES.ERRORS
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.FIND).error(
            DATABASE_ERRORS.ERROR_SEACHING + ": " + this.dbName + "\n" + e
          )
        : false;

      this.mongoDbConexionState = MONGO_DB_CONEXION_STATES.DISCONNECTED;

      LOGGER_FUNCTION_LOG_LEVEL.FIND >= LOGGER_LOG_LEVES.BASIC
        ? Logger.getLogger(this.LOGGER_NAME + LOGGER_FUNCTIONS.FIND).info(
            "Finished"
          )
        : false;
      return { result: false, error: `${className}: find: Error ${e}` };
    }
  };
}
