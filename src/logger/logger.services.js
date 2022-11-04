// Define "require"
import { createRequire } from "module";
import { fileURLToPath } from "url";
const require = createRequire(import.meta.url);
const path = require("path");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import winston from "winston";
import { resolve } from "path";

/*winston.addColors({
  error: "red",
  warn: "yellow",
  info: "cyan",
  debug: "green",
});*/

export class Logger {
  static getLogger(label) {
    if (!winston.loggers.has(label)) {
      winston.loggers.add(label, {
        transports: [Logger.consoleTransport /*, Logger.fileTransport*/],
        format: winston.format.label({ label }),
      });
    }
    return winston.loggers.get(label);
  }

  static logFormatTemplate(i) {
    return `${i.timestamp} ${i.level} [${i.label}] ${i.message}`;
  }

  static consoleTransport = new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.cli(),
      winston.format.printf(Logger.logFormatTemplate)
    ),
  });

  static fileTransport = new winston.transports.File({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(Logger.logFormatTemplate)
    ),
    filename: resolve("./myLogs.log"),
    level: "info",
  });
}
