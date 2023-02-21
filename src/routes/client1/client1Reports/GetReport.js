/* Import defined Reports // */
import { allBatchCounterReset } from "./AllBatchCounterReset/AllBatchCounterReset.js";
import { mmlTempTime } from "./MMLTempTime/MMLTempTime.js";

const debug = {
  GetReport: 3,
};

const functionName = `GetReport => `;

async function getReport(receivedData, db) {
  try {
    if (debug.GetReport >= 1) {
      console.log(`${functionName}GetReport: Start`.cyan);
    }
    if (debug.GetReport >= 3) {
      console.log(
        `${functionName}GetReport: Received data: ${JSON.stringify(
          receivedData,
          null,
          2
        )}`
      );
    }
    let response = 0;
    switch (receivedData.reportName) {
      case "allBatchCounterReset":
        response = (await allBatchCounterReset(receivedData, db)).response;
        break;
      case "mmlTempTime":
        response = (await mmlTempTime(receivedData, db)).response;
        break;
    }

    if (debug.GetReport >= 3) {
      console.log(
        `${functionName}GetReport: Response: ${JSON.stringify(
          response,
          null,
          2
        )}`
      );
    }

    if (debug.GetReport >= 1) {
      console.log(`${functionName}GetReport: Finished`.cyan);
    }
    return { result: true, response: response };
  } catch (e) {
    console.log(`${functionName}GetReport: Error: ${e}`.red);
  }
}

export { getReport };
