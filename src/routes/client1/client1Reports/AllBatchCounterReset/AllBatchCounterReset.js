const debug = {
  allBatchCounterReset: 2,
  getFormatedFinalData: 2,
  getAllBatchCounterResetFilter: 2,
  getBatchCounterMaxValue: 2,
  getMinValue: 2,
  getSumOfValues: 3,
  getCounterValueByBatchCounterResetSum: 3,
  getCounterCuts: 3,
  getBatchTotalHooks: 3,
};

const functionName = `allBatchCounterReset => `;

export async function allBatchCounterReset(receivedData, db) {
  try {
    if (debug.allBatchCounterReset >= 1) {
      console.log(`${functionName}allBatchCounterReset: Start`.cyan);
    }
    if (debug.allBatchCounterReset >= 3) {
      console.log(
        `${functionName}allBatchCounterReset: Received data: ${JSON.stringify(
          receivedData,
          null,
          2
        )}`
      );
    }

    /******************************  Creating filter for report **************************/
    if (debug.allBatchCounterReset >= 2) {
      console.log(
        `${functionName}allBatchCounterReset: Creating Filter for Report`.yellow
      );
    }

    let filter = await getallBatchCounterResetFilter(receivedData);

    if (debug.allBatchCounterReset >= 3) {
      console.log(
        `${functionName}allBatchCounterReset: Created Filter: ${JSON.stringify(
          filter,
          null,
          2
        )}`
      );
    }

    if (debug.allBatchCounterReset >= 2) {
      console.log(`${functionName}allBatchCounterReset: Filter created`.yellow);
    }

    /******************************  Verifying database conexion **************************/

    if (debug.allBatchCounterReset >= 2) {
      console.log(
        `${functionName}allBatchCounterReset: Verifying database conexion`
          .yellow
      );
    }
    let conexionStatus = await db.getConexionStatus();

    if (!conexionStatus.result) {
      console.log(
        `${functionName}allBatchCounterReset: Error: database disconnected`
      );
      if (debug.allBatchCounterReset >= 1) {
        console.log(`${functionName}allBatchCounterReset: Finished`.cyan);
      }
      return {
        result: false,
        error: `${functionName}allBatchCounterReset: Error: database disconnected`,
      };
    }

    if (debug.allBatchCounterReset >= 2) {
      console.log(
        `${functionName}allBatchCounterReset: Database is connected`.yellow
      );
    }

    /****************************** Execute database query **************************/

    if (debug.allBatchCounterReset >= 2) {
      console.log(
        `${functionName}allBatchCounterReset: Executing database query`.yellow
      );
    }
    //let resultData = filter ? await db.find("eventsBe", filter, {}) : null;

    let resultData = await db.find("eventsBe", filter, {});

    if (debug.allBatchCounterReset >= 3) {
      console.log(
        `${functionName}allBatchCounterReset: Database query resultData: ${JSON.stringify(
          resultData,
          null,
          2
        )}`
      );
    }

    if (debug.allBatchCounterReset >= 2) {
      console.log(
        `${functionName}allBatchCounterReset: Database query finished`.yellow
      );
    }

    if (resultData.response.length == 0) {
      let response = {
        Cortes: "",
        "Total Lotes": "",
        "Contador Lote Max.": "",
        valueTimeArray: [],
      };
      return { result: true, response: response };
    }

    /****************************** get formated data to send **************************/

    if (debug.allBatchCounterReset >= 2) {
      console.log(
        `${functionName}allBatchCounterReset: getting formated data to send`
          .yellow
      );
    }

    let finalData = (await getFormatedFinalData(resultData.response)).response;

    if (debug.allBatchCounterReset >= 3) {
      console.log(
        `${functionName}allBatchCounterReset: Database to send: ${JSON.stringify(
          finalData,
          null,
          2
        )}`
      );
    }

    if (debug.allBatchCounterReset >= 2) {
      console.log(
        `${functionName}allBatchCounterReset: formated data id ready`.yellow
      );
    }

    if (debug.allBatchCounterReset >= 1) {
      console.log(`${functionName}allBatchCounterReset: Finished`.cyan);
    }

    return { result: true, response: finalData };
  } catch (e) {
    console.log(`${functionName}allBatchCounterReset: Error: ${e}`.red);
  }
}

async function getFormatedFinalData(receivedData) {
  if (debug.allBatchCounterReset >= 1) {
    console.log(`${functionName}getFormatedFinalData: Start`.cyan);
  }

  if (debug.allBatchCounterReset >= 3) {
    console.log(
      `${functionName}getFormatedFinalData: Received data: ${JSON.stringify(
        receivedData,
        null,
        2
      )}`
    );
  }

  if (debug.allBatchCounterReset >= 2) {
    console.log(
      `${functionName}getFormatedFinalData: Formating data to send to client`
        .yellow
    );
  }

  /******************************  formating data to send **************************/

  /******************************  Creating Value Time Array **************************/

  if (debug.allBatchCounterReset >= 2) {
    console.log(
      `${functionName}getFormatedFinalData: Creating valueTimeArray`.yellow
    );
  }

  let valueTimeArray = [];
  for (let i = 0; i < receivedData.length; i++) {
    let keyPairData = {
      Evento: "",
      Contador: "",
      "Contador Lote": "",
      "Ganchos Vacios Lote": "",
      "Total Ganchos Lote": "",
      "Numero Lote": "",
      dateTime: "",
    };
    keyPairData.Evento = receivedData[i].datos.type;
    keyPairData.Contador = removeTag(receivedData[i].datos.value[0]);
    keyPairData["Contador Lote"] = removeTag(receivedData[i].datos.value[1]);
    keyPairData["Ganchos Vacios Lote"] = removeTag(
      receivedData[i].datos.value[2]
    );
    keyPairData["Total Ganchos Lote"] = String(
      Number(keyPairData["Contador Lote"]) +
        Number(keyPairData["Ganchos Vacios Lote"])
    );
    keyPairData["Numero Lote"] = removeTag(receivedData[i].datos.value[3]);
    keyPairData.dateTime = receivedData[i].datos.processDateTime;
    valueTimeArray.push(keyPairData);
  }

  if (debug.allBatchCounterReset >= 3) {
    console.log(
      `${functionName}getFormatedFinalData: Formated data: ${JSON.stringify(
        valueTimeArray,
        null,
        2
      )}`
    );
  }

  if (debug.allBatchCounterReset >= 2) {
    console.log(
      `${functionName}getFormatedFinalData: valueTimeArray creation finished`
        .yellow
    );
  }

  /******************************  calculating counterCuts *************************/

  if (debug.allBatchCounterReset >= 2) {
    console.log(
      `${functionName}getFormatedFinalData: calculating counterCuts`.yellow
    );
  }

  let counterCuts = getCounterCuts(valueTimeArray);

  if (debug.allBatchCounterReset >= 3) {
    console.log(
      `${functionName}getFormatedFinalData: counterCuts: ${counterCuts}`
    );
  }

  if (debug.allBatchCounterReset >= 2) {
    console.log(
      `${functionName}getFormatedFinalData: counterCuts calculation finished`
        .yellow
    );
  }

  /******************************  calculating Sum of batchCounterResets ***********/

  if (debug.allBatchCounterReset >= 2) {
    console.log(
      `${functionName}getFormatedFinalData: calculating sum of batchCounters`
        .yellow
    );
  }

  let sum = getCounterValueByBatchCounterResetSum(valueTimeArray);

  if (debug.allBatchCounterReset >= 3) {
    console.log(
      `${functionName}getFormatedFinalData: sum of batchCounters: ${sum}`
    );
  }

  if (debug.allBatchCounterReset >= 2) {
    console.log(
      `${functionName}getFormatedFinalData: sum calculation of batchCounters finished`
        .yellow
    );
  }

  /******************************  calculating max of values *************************/

  if (debug.allBatchCounterReset >= 2) {
    console.log(
      `${functionName}getFormatedFinalData: calculating max of batchCounters`
        .yellow
    );
  }
  // get max of values
  let max = getBatchCounterMaxValue(valueTimeArray);

  if (debug.allBatchCounterReset >= 3) {
    console.log(
      `${functionName}getFormatedFinalData: max of batchCounters: ${max}`
    );
  }

  if (debug.allBatchCounterReset >= 2) {
    console.log(
      `${functionName}getFormatedFinalData: max calculation of batchCounters finished`
        .yellow
    );
  }

  /*********************************** formating data *******************************/

  let response = {
    Cortes: counterCuts,
    "Total Lotes": sum,
    "Contador Lote Max.": max,
    valueTimeArray: valueTimeArray,
  };

  if (debug.allBatchCounterReset >= 3) {
    console.log(
      `${functionName}getFormatedFinalData: Formated data: ${JSON.stringify(
        response,
        null,
        2
      )}`
    );
  }

  if (debug.allBatchCounterReset >= 2) {
    console.log(
      `${functionName}getFormatedFinalData: Formating data to send finished`
        .yellow
    );
  }

  return { result: true, response: response };
}

async function getallBatchCounterResetFilter(receivedData) {
  return {
    $and: [
      { "datos.idFromTh": { $eq: `${receivedData.id}` } },
      { "datos.idToTh": { $eq: `${receivedData.id}` } },
      //{ "datos.type": `batchCounterReset` },
      {
        $or: [
          { "datos.type": `batchCounterReset` },
          { "datos.type": `mstart` },
          { "datos.type": `mstop` },
          { "datos.type": `noMoreChickensReset` },
          { "datos.type": `stoppedMachineReset` },
        ],
      },
      { "datos.processDateTime": { $gte: `${receivedData.inicio}` } },
      { "datos.processDateTime": { $lte: `${receivedData.fin}` } },
    ],
  };
}

function getBatchCounterMaxValue(dataArray) {
  if (debug.getBatchCounterMaxValue >= 1) {
    console.log(`${functionName}getBatchCounterMaxValue: Start`.cyan);
  }

  if (debug.getBatchCounterMaxValue >= 2) {
    console.log(
      `${functionName}getBatchCounterMaxValue: Calculating BatchCounterMaxValue`
        .yellow
    );
  }

  let BatchCounterMaxValue = -1000;
  for (let i = 0; i < dataArray.length; i++) {
    if (BatchCounterMaxValue < Number(dataArray[i]["Contador Lote"])) {
      BatchCounterMaxValue = Number(dataArray[i]["Contador Lote"]);
    }
  }

  if (debug.getBatchCounterMaxValue >= 3) {
    console.log(
      `${functionName}getBatchCounterMaxValue: calculed BatchCounterMaxValue: ${BatchCounterMaxValue}`
        .cyan
    );
  }

  if (debug.getBatchCounterMaxValue >= 1) {
    console.log(`${functionName}getBatchCounterMaxValue: Finished`.cyan);
  }

  return String(Number(BatchCounterMaxValue).toFixed(0));
}

function getMinValue(dataArray) {
  if (debug.getMinValue >= 1) {
    console.log(`${functionName}getMinValue: Start`.cyan);
  }

  if (debug.getMinValue >= 2) {
    console.log(`${functionName}getMinValue: Calculating minValue`.yellow);
  }

  let minValue = 1000000000;
  for (let i = 0; i < dataArray.length; i++) {
    if (minValue > Number(dataArray[i].batchCounter)) {
      minValue = Number(dataArray[i].batchCounter);
    }
  }

  if (debug.getMinValue >= 3) {
    console.log(
      `${functionName}getMinValue: calculated minValue: ${minValue}`.cyan
    );
  }

  if (debug.getMinValue >= 1) {
    console.log(`${functionName}getMinValue: Finished`.cyan);
  }

  return String(Number(minValue).toFixed(0));
}

function getSumOfValues(dataArray) {
  if (debug.getSumOfValues >= 1) {
    console.log(`${functionName}getSumOfValues: Start`.cyan);
  }

  if (debug.getSumOfValues >= 3) {
    console.log(
      `${functionName}getSumOfValues: Received data: ${JSON.stringify(
        dataArray,
        null,
        2
      )}`
    );
  }

  if (debug.getSumOfValues >= 2) {
    console.log(
      `${functionName}getSumOfValues: Calculating SumOfValues`.yellow
    );
  }

  let sumValue = 0;
  for (let i = 0; i < dataArray.length; i++) {
    sumValue = sumValue + Number(dataArray[i].batchCounter);
  }

  if (debug.getSumOfValues >= 3) {
    console.log(
      `${functionName}getSumOfValues: calculated sumValue: ${sumValue}`.cyan
    );
  }

  if (debug.getSumOfValues >= 1) {
    console.log(`${functionName}getSumOfValues: Finished`.cyan);
  }

  return String(Number(sumValue).toFixed(0));
}

// Calculate the value of counter adding all batchCounter of every batchCounterReset
function getCounterValueByBatchCounterResetSum(dataArray) {
  if (debug.getCounterValueByBatchCounterResetSum >= 1) {
    console.log(
      `${functionName}getCounterValueByBatchCounterResetSum: Start`.cyan
    );
  }

  if (debug.getCounterValueByBatchCounterResetSum >= 3) {
    console.log(
      `${functionName}getCounterValueByBatchCounterResetSum: Received data: ${JSON.stringify(
        dataArray,
        null,
        2
      )}`
    );
  }

  if (debug.getCounterValueByBatchCounterResetSum >= 2) {
    console.log(
      `${functionName}getCounterValueByBatchCounterResetSum: Calculating BatchCounterResetsSum`
        .yellow
    );
  }

  let sumValue = 0;
  for (let i = 0; i < dataArray.length; i++) {
    if (
      dataArray[i].Evento == "batchCounterReset" ||
      dataArray[i].Evento == "noMoreChickensReset" ||
      dataArray[i].Evento == "stoppedMachineReset"
    ) {
      console.log(
        `${functionName}getCounterValueByBatchCounterResetSum: type[${i}]: ${dataArray[i].type}`
      );

      sumValue = sumValue + Number(dataArray[i]["Contador Lote"]);

      console.log(
        `${functionName}getCounterValueByBatchCounterResetSum: type[${i}]: ${sumValue}`
      );
      console.log(
        `${functionName}getCounterValueByBatchCounterResetSum: counter[${i}]: ${dataArray[i].counter}`
      );
    }
  }

  if (debug.getCounterValueByBatchCounterResetSum >= 3) {
    console.log(
      `${functionName}getCounterValueByBatchCounterResetSum: calculated sumValue: ${sumValue}`
        .cyan
    );
  }

  if (debug.getCounterValueByBatchCounterResetSum >= 1) {
    console.log(
      `${functionName}getCounterValueByBatchCounterResetSum: Finished`.cyan
    );
  }

  return String(Number(sumValue).toFixed(0));
}

function getCounterCuts(dataArray) {
  if (debug.getCounterCuts >= 1) {
    console.log(`${functionName}getCounterCuts: Start`.cyan);
  }

  if (debug.getCounterCuts >= 3) {
    console.log(
      `${functionName}getCounterCuts: Received data: ${JSON.stringify(
        dataArray,
        null,
        2
      )}`
    );
  }

  if (debug.getCounterCuts >= 2) {
    console.log(
      `${functionName}getCounterCuts: Calculating counterCuts`.yellow
    );
  }

  let cuts = [];

  for (let i = 0; i < dataArray.length; i++) {
    if (
      dataArray[i].Evento == "noMoreChickensReset" ||
      dataArray[i].Evento == "stoppedMachineReset"
    ) {
      console.log(
        `${functionName}getCounterCuts: type[${i}]: ${dataArray[i].type}`
      );
      if (dataArray[i].Contador > 0) {
        cuts.push(dataArray[i].Contador);
      }
    }
  }

  if (debug.getCounterCuts >= 3) {
    console.log(`${functionName}getCounterCuts: calculated cuts: ${cuts}`);
  }

  if (debug.getCounterCuts >= 1) {
    console.log(`${functionName}getCounterCuts: Finished`.cyan);
  }

  return cuts;
}

const removeTag = (data) => {
  if (Array.isArray(data)) {
    return data[0].replace(/v::/g, "");
  }
  return data.replace(/v::/g, "");
};
