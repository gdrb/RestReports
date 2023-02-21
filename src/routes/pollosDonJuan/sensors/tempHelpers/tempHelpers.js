import {
  CLASS_NAME,
  FUNCTIONS_NAMES,
  FUNCTION_LOG_LEVEL,
  LOG_LEVES,
} from "./tempHelpers.logger.config.js";

import colors from "colors";

export function retrieveValuesTimeArray() {}

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
  if (FUNCTION_LOG_LEVEL.RETRIEVE_TEMP_VALUE_TIME_ARRAY >= LOG_LEVES.BASIC) {
    console.log(
      `${CLASS_NAME} ${FUNCTIONS_NAMES.RETRIEVE_TEMP_VALUE_TIME_ARRAY} Finished`
        .cyan
    );
  }
  return { result: true, response: tempValueTimeArray };
};

function retrieveCounterValueTimeArray() {}

export const retrieveValueTimeArray = (dataType, dataArray) => {
  if (FUNCTION_LOG_LEVEL.RETRIEVE_TEMP_VALUE_TIME_ARRAY >= LOG_LEVES.BASIC) {
    console.log(
      `${CLASS_NAME} ${FUNCTIONS_NAMES.RETRIEVE_TEMP_VALUE_TIME_ARRAY} Start1`
        .cyan
    );
  }

  if (
    FUNCTION_LOG_LEVEL.RETRIEVE_TEMP_VALUE_TIME_ARRAY >= LOG_LEVES.VARIABLES
  ) {
    console.log(
      `${CLASS_NAME} ${FUNCTIONS_NAMES.RETRIEVE_TEMP_VALUE_TIME_ARRAY} Received dataType ${dataType}`
    );
    console.log(
      `${CLASS_NAME} ${
        FUNCTIONS_NAMES.RETRIEVE_TEMP_VALUE_TIME_ARRAY
      } Received dataArray ${JSON.stringify(dataArray)}`
    );
  }

  if (FUNCTION_LOG_LEVEL.RETRIEVE_TEMP_VALUE_TIME_ARRAY >= LOG_LEVES.DETAILED) {
    console.log(
      `${CLASS_NAME} ${FUNCTIONS_NAMES.RETRIEVE_TEMP_VALUE_TIME_ARRAY} Constructing Value Time Array`
        .yellow
    );
  }

  if (FUNCTION_LOG_LEVEL.RETRIEVE_TEMP_VALUE_TIME_ARRAY >= LOG_LEVES.DETAILED) {
    console.log(
      `${CLASS_NAME} ${FUNCTIONS_NAMES.RETRIEVE_TEMP_VALUE_TIME_ARRAY} Defining value name`
        .yellow
    );
  }

  let valueName = getValueName(dataType);

  if (
    FUNCTION_LOG_LEVEL.RETRIEVE_TEMP_VALUE_TIME_ARRAY >= LOG_LEVES.VARIABLES
  ) {
    console.log(
      `${CLASS_NAME} ${FUNCTIONS_NAMES.RETRIEVE_TEMP_VALUE_TIME_ARRAY} valueName ${valueName}`
    );
  }

  if (!valueName) {
    return valueName;
  }

  let valueTimeArray = [];
  for (let i = 0; i < dataArray.length; i++) {
    let keyPairData = {
      dataName: "",
      dateTime: "",
    };
    keyPairData.dataName = removeTag(dataArray[i].datos.value);
    keyPairData.dateTime = dataArray[i].datos.processDateTime;
    valueTimeArray.push(keyPairData);
  }
  if (FUNCTION_LOG_LEVEL.RETRIEVE_TEMP_VALUE_TIME_ARRAY >= LOG_LEVES.BASIC) {
    console.log(
      `${CLASS_NAME} ${FUNCTIONS_NAMES.RETRIEVE_TEMP_VALUE_TIME_ARRAY} Finished`
        .cyan
    );
  }

  return { result: true, response: valueTimeArray };
};

export const getMaxTemp = (dataArray) => {
  console.log(
    `tempHelpers => getMaxTemp: received dataArray: ${JSON.stringify(
      dataArray,
      null,
      2
    )}`
  );
  let maxTemp = -1000;
  for (let i = 0; i < dataArray.length; i++) {
    if (maxTemp < Number(dataArray[i].temp)) {
      maxTemp = Number(dataArray[i].temp);
    }
  }
  return String(Number(maxTemp).toFixed(1));
};

export const getMaxValue = (dataArray) => {
  console.log(
    `Helpers => getMaxValue: received dataArray: ${JSON.stringify(
      dataArray,
      null,
      2
    )}`
  );
  let maxValue = -1000;
  for (let i = 0; i < dataArray.length; i++) {
    if (maxValue < Number(dataArray[i].dataName)) {
      maxValue = Number(dataArray[i].dataName);
    }
  }
  console.log(`Helpers => getMaxValue: calculated maxVaue: ${maxValue}`);
  return String(Number(maxValue).toFixed(1));
};

export const getMinTemp = (dataArray) => {
  let minTemp = 1000;
  for (let i = 0; i < dataArray.length; i++) {
    if (minTemp > Number(dataArray[i].temp)) {
      minTemp = Number(dataArray[i].temp);
    }
  }
  return String(Number(minTemp).toFixed(1));
};

export const getMinValue = (dataArray) => {
  console.log(
    `Helpers => getMinValue: received dataArray: ${JSON.stringify(
      dataArray,
      null,
      2
    )}`
  );
  let minValue = 1000;
  for (let i = 0; i < dataArray.length; i++) {
    if (minValue > Number(dataArray[i].dataName)) {
      minValue = Number(dataArray[i].dataName);
    }
  }
  return String(Number(minValue).toFixed(1));
};

export const getLastTemp = (dataArray) => {
  return String(Number(dataArray[0].temp).toFixed(1));
};

export const getLastValue = (dataArray) => {
  return String(Number(dataArray[0].dataName).toFixed(1));
};

const removeTag = (data) => {
  if (Array.isArray(data)) {
    return data[0].replace(/v::/g, "");
  }
  return data.replace(/v::/g, "");
};

function getValueName(receivedData) {
  console.log(`tempHelpers => getValueName: Start`);
  console.log(
    `tempHelpers => getValueName: ${JSON.stringify(receivedData, null, 2)}`
  );
  if (!receivedData) {
    return { result: false, error: `received data is undefined` };
  }

  switch (receivedData) {
    case "tempChange":
      return "temp";
    default:
      console.log(
        `tempHelpers => getValueName: receivedData type not recognized`
      );
      return "";
  }
}
