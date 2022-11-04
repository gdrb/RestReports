import { DataBase } from "../db/db.services.js";

export class DbConexionProvider extends DataBase {
  constructor() {
    super("1");
    this.initializaDb();
  }

  initializaDb = () => {
    this.start();
  };
}
