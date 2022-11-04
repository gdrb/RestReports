export const LOGGER_LOG_LEVES = {
  NO_LOG: -2,
  ERRORS: -1,
  WARNS: 0,
  BASIC: 1,
  DETAILED: 2,
  VARIABLES: 3,
};

export const LOGGER_FUNCTIONS = {
  CONSTRUCTOR: "CONSTRUCTOR",
  START: "START",
  STOP: "STOP",
  CONNECT: "CONNECT",
  DISCONNECT: "DISCONNECT",
  RECONNECT: "RECONNECT",
  GET_CONEXION_STATUS: "GET_CONEXION_STATUS",
  INSERT_UPDATE_ONE: "INSERT_UPDATE_ONE",
  INSERT_ONE: "INSERT_ONE",
  INSERT_MANY: "INSERT_MANY",
  UPDATE_ONE: "UPDATE_ONE",
  UPDATE_MANY: "UPDATE_MANY",
  DELETE_ONE: "DELETE_ONE",
  DELETE_MANY: "DELETE_MANY",
  FIND: "FIND",
};

export const LOGGER_FUNCTION_LOG_LEVEL = {
  CONSTRUCTOR: LOGGER_LOG_LEVES.WARNS,
  START: LOGGER_LOG_LEVES.WARNS,
  STOP: LOGGER_LOG_LEVES.WARNS,
  CONNECT: LOGGER_LOG_LEVES.WARNS,
  DISCONNECT: LOGGER_LOG_LEVES.WARNS,
  RECONNECT: LOGGER_LOG_LEVES.WARNS,
  GET_CONEXION_STATUS: LOGGER_LOG_LEVES.WARNS,
  INSERT_UPDATE_ONE: LOGGER_LOG_LEVES.WARNS,
  INSERT_ONE: LOGGER_LOG_LEVES.WARNS,
  INSERT_MANY: LOGGER_LOG_LEVES.WARNS,
  UPDATE_ONE: LOGGER_LOG_LEVES.WARNS,
  UPDATE_MANY: LOGGER_LOG_LEVES.WARNS,
  DELETE_ONE: LOGGER_LOG_LEVES.WARNS,
  DELETE_MANY: LOGGER_LOG_LEVES.WARNS,
  FIND: LOGGER_LOG_LEVES.WARNS,
};