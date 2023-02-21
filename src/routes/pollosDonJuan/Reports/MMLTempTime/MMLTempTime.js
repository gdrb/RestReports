/* MML = Maximal, Minimal, Last */

const debug = {
  mmlTempTime: 3,
  getTempChangeFilter: 3,
  getMaxTemp: 3,
  getMinTemp: 3,
  getLastTemp: 3,
};

const functionName = `MMLTempTime => `;

export async function mmlTempTime(receivedData, db) {
  try {
    if (debug.mmlTempTime >= 1) {
      console.log(`${functionName}mmlTempTime: Start`.cyan);
    }

    if (debug.mmlTempTime >= 3) {
      console.log(
        `${functionName}mmlTempTime: Received data: ${JSON.stringify(
          receivedData,
          null,
          2
        )}`
      );
    }

    /******************************  Creating filter for report **************************/
    if (debug.mmlTempTime >= 2) {
      console.log(
        `${functionName}mmlTempTime: Creating Filter for Report`.yellow
      );
    }

    let filter = getTempChangeFilter(receivedData);

    if (debug.mmlTempTime >= 3) {
      console.log(
        `${functionName}mmlTempTime: Created Filter: ${JSON.stringify(
          filter,
          null,
          2
        )}`
      );
    }

    if (debug.mmlTempTime >= 2) {
      console.log(`${functionName}mmlTempTime: Filter created`.yellow);
    }

    /******************************  Verifying database conexion **************************/

    if (debug.mmlTempTime >= 2) {
      console.log(
        `${functionName}mmlTempTime: Verifying database conexion`.yellow
      );
    }
    let conexionStatus = await db.getConexionStatus();

    if (!conexionStatus.result) {
      res.json(conexionStatus);
      console.log(`${functionName}mmlTempTime: Error: database disconnected`);
      if (debug.mmlTempTime >= 1) {
        console.log(`${functionName}mmlTempTime: Finished`.cyan);
      }
      return {
        result: false,
        error: `${functionName}mmlTempTime: Error: database disconnected`,
      };
    }

    if (debug.mmlTempTime >= 2) {
      console.log(`${functionName}mmlTempTime: Database is connected`.yellow);
    }

    /****************************** Execute database query **************************/

    if (debug.mmlTempTime >= 2) {
      console.log(
        `${functionName}mmlTempTime: Executing database query`.yellow
      );
    }

    let resultData = await db.find("eventsBe", filter, {});

    if (debug.mmlTempTime >= 3) {
      console.log(
        `${functionName}mmlTempTime: Database query resultData: ${JSON.stringify(
          resultData,
          null,
          2
        )}`
      );
    }

    if (debug.mmlTempTime >= 2) {
      console.log(`${functionName}mmlTempTime: Database query finished`.yellow);
    }

    if (resultData.response.length == 0) {
      let response = {
        Maxima: "",
        Minima: "",
        "Ultimo Valor": "",
        valueTimeArray: [],
      };
      return { result: true, response: response };
    }

    /****************************** get formatted data to send **************************/

    if (debug.mmlTempTime >= 2) {
      console.log(
        `${functionName}mmlTempTime: getting formated data to send`.yellow
      );
    }

    let finalData = (await getFormatedFinalData(resultData.response)).response;

    if (debug.mmlTempTime >= 3) {
      console.log(
        `${functionName}mmlTempTime: Formated data to send: ${JSON.stringify(
          finalData,
          null,
          2
        )}`
      );
    }

    if (debug.mmlTempTime >= 2) {
      console.log(`${functionName}mmlTempTime: formated data id ready`.yellow);
    }

    if (debug.mmlTempTime >= 1) {
      console.log(`${functionName}mmlTempTime: Finished`.cyan);
    }

    return { result: true, response: finalData };
  } catch (e) {
    console.log(`${functionName}mmlTempTime: Error: ${e}`.red);
  }
}

async function getFormatedFinalData(receivedData) {
  if (debug.mmlTempTime >= 1) {
    console.log(`${functionName}getFormatedFinalData: Start`.cyan);
  }

  if (debug.mmlTempTime >= 3) {
    console.log(
      `${functionName}getFormatedFinalData: Received data: ${JSON.stringify(
        receivedData,
        null,
        2
      )}`
    );
  }

  if (debug.mmlTempTime >= 2) {
    console.log(
      `${functionName}getFormatedFinalData: Formating data to send to client`
        .yellow
    );
  }

  /******************************  formating data to send **************************/

  /******************************  Creating Value Time Array **************************/

  if (debug.mmlTempTime >= 2) {
    console.log(
      `${functionName}getFormatedFinalData: Creating valueTimeArray`.yellow
    );
  }

  let valueTimeArray = [];
  for (let i = 0; i < receivedData.length; i++) {
    let keyPairData = {
      type: "",
      temp: "",
      dateTime: "",
    };
    keyPairData.type = receivedData[i].datos.type;
    keyPairData.temp = removeTag(receivedData[i].datos.value[0]);
    keyPairData.dateTime = receivedData[i].datos.processDateTime;
    valueTimeArray.push(keyPairData);
  }

  if (debug.mmlTempTime >= 3) {
    console.log(
      `${functionName}getFormatedFinalData: Formated data: ${JSON.stringify(
        valueTimeArray,
        null,
        2
      )}`
    );
  }

  if (debug.mmlTempTime >= 2) {
    console.log(
      `${functionName}getFormatedFinalData: valueTimeArray creation finished`
        .yellow
    );
  }

  /******************************  calculating Max Temp *************************/

  if (debug.mmlTempTime >= 2) {
    console.log(
      `${functionName}getFormatedFinalData: calculating Max Temp`.yellow
    );
  }
  // get max of values
  let max = getMaxTemp(valueTimeArray);

  if (debug.mmlTempTime >= 3) {
    console.log(`${functionName}getFormatedFinalData: Max temp: ${max}`);
  }

  if (debug.mmlTempTime >= 2) {
    console.log(
      `${functionName}getFormatedFinalData: Max Temp calculation finished`
        .yellow
    );
  }

  /******************************  calculating Min Temp *************************/

  if (debug.mmlTempTime >= 2) {
    console.log(
      `${functionName}getFormatedFinalData: calculating Min Temp`.yellow
    );
  }
  // get min of values
  let min = getMinTemp(valueTimeArray);

  if (debug.mmlTempTime >= 3) {
    console.log(`${functionName}getFormatedFinalData: Min temp: ${min}`);
  }

  if (debug.mmlTempTime >= 2) {
    console.log(
      `${functionName}getFormatedFinalData: Min Temp calculation finished`
        .yellow
    );
  }

  /******************************  calculating Last Temp *************************/

  if (debug.mmlTempTime >= 2) {
    console.log(
      `${functionName}getFormatedFinalData: calculating Min Temp`.yellow
    );
  }
  // get min of values
  let last = getLastTemp(valueTimeArray);

  if (debug.mmlTempTime >= 3) {
    console.log(`${functionName}getFormatedFinalData: Last temp: ${last}`);
  }

  if (debug.mmlTempTime >= 2) {
    console.log(
      `${functionName}getFormatedFinalData: Last Temp calculation finished`
        .yellow
    );
  }

  /*********************************** formating data *******************************/

  let response = {
    Maxima: max,
    Minima: min,
    "Ultimo Valor": last,
    valueTimeArray: valueTimeArray,
  };

  if (debug.mmlTempTime >= 3) {
    console.log(
      `${functionName}getFormatedFinalData: Formated data: ${JSON.stringify(
        response,
        null,
        2
      )}`
    );
  }

  if (debug.mmlTempTime >= 2) {
    console.log(
      `${functionName}getFormatedFinalData: Formating data to send finished`
        .yellow
    );
  }

  return { result: true, response: response };
}

function getMaxTemp(dataArray) {
  if (debug.getMaxTemp >= 1) {
    console.log(`${functionName}getMaxTemp: Start`.cyan);
  }

  if (debug.getMaxTemp >= 3) {
    console.log(
      `${functionName}getMaxTemp: Received data: ${JSON.stringify(
        dataArray,
        null,
        2
      )}`
    );
  }

  if (debug.getMaxTemp >= 2) {
    console.log(`${functionName}getMaxTemp: Calculating Max Temp`.yellow);
  }

  let maxTemp = -1000;
  for (let i = 0; i < dataArray.length; i++) {
    if (maxTemp < Number(dataArray[i].temp)) {
      maxTemp = Number(dataArray[i].temp);
    }
  }

  if (debug.getMaxTemp >= 3) {
    console.log(`${functionName}getMaxTemp: Calculated Max Temp: ${maxTemp}`);
  }

  if (debug.getMaxTemp >= 2) {
    console.log(
      `${functionName}getMaxTemp: Max Temp calculation finished`.yellow
    );
  }

  if (debug.getMaxTemp >= 1) {
    console.log(`${functionName}getMaxTemp: Finished`.cyan);
  }

  return String(Number(maxTemp).toFixed(1));
}

function getMinTemp(dataArray) {
  if (debug.getMinTemp >= 1) {
    console.log(`${functionName}getMinTemp: Start`.cyan);
  }

  if (debug.getMinTemp >= 3) {
    console.log(
      `${functionName}getMinTemp: Received data: ${JSON.stringify(
        dataArray,
        null,
        2
      )}`
    );
  }

  if (debug.getMinTemp >= 2) {
    console.log(`${functionName}getMinTemp: Calculating Min Temp`.yellow);
  }

  let minTemp = 1000;
  for (let i = 0; i < dataArray.length; i++) {
    if (minTemp > Number(dataArray[i].temp)) {
      minTemp = Number(dataArray[i].temp);
    }
  }

  if (debug.getMinTemp >= 3) {
    console.log(`${functionName}getMinTemp: Calculated Min Temp: ${minTemp}`);
  }

  if (debug.getMinTemp >= 2) {
    console.log(
      `${functionName}getMinTemp: Min Temp calculation finished`.yellow
    );
  }

  if (debug.getMinTemp >= 1) {
    console.log(`${functionName}getMinTemp: Finished`.cyan);
  }

  return String(Number(minTemp).toFixed(1));
}

function getLastTemp(dataArray) {
  if (debug.getLastTemp >= 1) {
    console.log(`${functionName}getMinTemp: Start`.cyan);
  }

  if (debug.getLastTemp >= 3) {
    console.log(
      `${functionName}getMinTemp: Received data: ${JSON.stringify(
        dataArray,
        null,
        2
      )}`
    );
  }

  if (debug.getLastTemp >= 2) {
    console.log(`${functionName}getMinTemp: Calculating Min Temp`.yellow);
  }

  let lastTemp = String(Number(dataArray[0].temp).toFixed(1));

  if (debug.getLastTemp >= 3) {
    console.log(`${functionName}getMinTemp: Calculated Last Temp: ${lastTemp}`);
  }

  if (debug.getLastTemp >= 2) {
    console.log(
      `${functionName}getLastTemp: Last Temp calculation finished`.yellow
    );
  }

  if (debug.getLastTemp >= 1) {
    console.log(`${functionName}getLastTemp: Finished`.cyan);
  }
  return lastTemp;
}

function getTempChangeFilter(receivedData) {
  return {
    $and: [
      { "datos.idFromTh": { $eq: `${receivedData.id}` } },
      { "datos.idToTh": { $eq: `${receivedData.id}` } },
      { "datos.type": `tempChange` },
      { "datos.processDateTime": { $gte: `${receivedData.inicio}` } },
      { "datos.processDateTime": { $lte: `${receivedData.fin}` } },
    ],
  };
}

const removeTag = (data) => {
  if (Array.isArray(data)) {
    return data[0].replace(/v::/g, "");
  }
  return data.replace(/v::/g, "");
};
