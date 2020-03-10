/** A module. Its name is module:foo/bar.
 * @module logger
 */
const winston = require("winston");

/**
 * Logger instance using winston under the hood
 * Here you can configure the transports you want to use in your differente enviroments, with the formats you may need.
 */
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.prettyPrint(),
    winston.format.colorize(),
    winston.format.simple(),
  ),
  transports: [
    new winston.transports.Console()
    // new winston.transports.File({ filename: 'combined.log' })
  ]
});

module.exports = logger;
