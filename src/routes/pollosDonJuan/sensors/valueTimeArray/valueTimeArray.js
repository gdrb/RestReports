export const retrieveValueTimeArray = (dataName, dataArray) => {
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
