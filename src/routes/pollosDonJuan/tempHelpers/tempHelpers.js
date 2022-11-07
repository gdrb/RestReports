import {
  CLASS_NAME,
  FUNCTIONS_NAMES,
  FUNCTION_LOG_LEVEL,
  LOG_LEVES,
} from "./tempHelpers.logger.config.js";

import colors from "colors";

export const retrieveTempValueTimeArray = (dataArray) => {
  if (FUNCTION_LOG_LEVEL.RETRIEVE_TEMP_VALUE_TIME_ARRAY >= LOG_LEVES.BASIC) {
    console.log(
      `${CLASS_NAME} ${FUNCTIONS_NAMES.RETRIEVE_TEMP_VALUE_TIME_ARRAY} Start`
        .cyan
    );
  }

  if (
    FUNCTION_LOG_LEVEL.RETRIEVE_TEMP_VALUE_TIME_ARRAY >= LOG_LEVES.VARIABLES
  ) {
    console.log(
      `${CLASS_NAME} ${
        FUNCTIONS_NAMES.RETRIEVE_TEMP_VALUE_TIME_ARRAY
      } Received dataArray ${JSON.stringify(dataArray)}`
    );
  }

  if (FUNCTION_LOG_LEVEL.RETRIEVE_TEMP_VALUE_TIME_ARRAY >= LOG_LEVES.DETAILED) {
    console.log(
      `${CLASS_NAME} ${FUNCTIONS_NAMES.RETRIEVE_TEMP_VALUE_TIME_ARRAY} Constructing Temp Value Time Array`
        .yellow
    );
  }

  let tempValueTimeArray = [];
  for (let i = 0; i < dataArray.length; i++) {
    let keyPairData = {
      temp: "",
      dateTime: "",
    };
    keyPairData.temp = removeTag(dataArray[i].datos.value);
    keyPairData.dateTime = dataArray[i].datos.processDateTime;
    tempValueTimeArray.push(keyPairData);
  }

  return { result: true, response: tempValueTimeArray };

  if (FUNCTION_LOG_LEVEL.RETRIEVE_TEMP_VALUE_TIME_ARRAY >= LOG_LEVES.BASIC) {
    console.log(
      `${CLASS_NAME} ${FUNCTIONS_NAMES.RETRIEVE_TEMP_VALUE_TIME_ARRAY} Finished`
        .cyan
    );
  }
};

export const getMaxTemp = (dataArray) => {
  let maxTemp = 0;
  for (let i = 0; i < dataArray.length; i++) {
    if (maxTemp < Number(dataArray[i].temp)) {
      maxTemp = Number(dataArray[i].temp);
    }
  }
  return String(maxTemp);
};

const removeTag = (data) => {
  if (Array.isArray(data)) {
    return data[0].replace(/v::/g, "");
  }
  return data.replace(/v::/g, "");
};
