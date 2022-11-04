import delay from "delay";
import { DATABASE_ERRORS, DB_CONEXION_STATES } from "./db.constants.js";
import { DataBase } from "./db.services.js";

// Instantiating Database Services
const DataBaseInstance = new DataBase("2", "Test");
const test = async () => {
  try {
    let startResult = await DataBaseInstance.start();

    while (!(await DataBaseInstance.getConexionStatus()).result);

    let dataToSyncTest = [];
    for (let i = 0; i < 5; i++) {
      dataToSyncTest.push({
        name: `Guillermo[${i}]`,
        lastName: `do Rego Barros[${i}]`,
        synced: false,
      });
    }

    let insertResults = await DataBaseInstance.insertMany(
      "Events",
      dataToSyncTest
    );

    let stopResult = await DataBaseInstance.stop();
  } catch (e) {
    console.log("db.services => test: Error: ", e);
  }
};

test();
