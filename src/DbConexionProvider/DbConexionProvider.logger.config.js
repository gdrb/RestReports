export const CLASS_NAME = "DB_CONEXION_PROVIDER";

export const LOG_LEVES = {
  NO_LOG: -2,
  ERRORS: -1,
  WARNS: 0,
  BASIC: 1,
  DETAILED: 2,
  VARIABLES: 3,
};

export const FUNCTIONS_NAMES = {
  CONSTRUCTOR: "CONSTRUCTOR =>",
  START: "START =>",
  TEST_INTERVAL: "TEST_INTERVAL =>",
  GET_CONEXION_STATUS: "GET_CONEXION_STATUS",
};

export const FUNCTION_LOG_LEVEL = {
  CONSTRUCTOR: LOG_LEVES.VARIABLES,
  START: LOG_LEVES.VARIABLES,
  TEST_INTERVAL: LOG_LEVES.VARIABLES,
  GET_CONEXION_STATUS: LOG_LEVES.VARIABLES,
};