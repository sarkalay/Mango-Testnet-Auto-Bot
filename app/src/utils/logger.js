import { createLogger, format, transports } from 'winston';
import _0x348a66 from 'fs';
const {
  combine,
  timestamp,
  printf,
  colorize
} = format;
const customFormat = printf(({
  level: _0x113165,
  message: _0x38a460,
  timestamp: _0x16d269
}) => {
  return _0x16d269 + " [" + _0x113165 + "]: " + _0x38a460;
});
class Logger {
  constructor() {
    this.logger = createLogger({
      'level': "debug",
      'format': combine(timestamp({
        'format': "YYYY-MM-DD HH:mm:ss"
      }), colorize(), customFormat),
      'transports': [new transports.File({
        'filename': "log/app.log"
      })],
      'exceptionHandlers': [new transports.File({
        'filename': "log/app.log"
      })],
      'rejectionHandlers': [new transports.File({
        'filename': "log/app.log"
      })]
    });
  }
  ["info"](_0x5d7f93) {
    this.logger.info(_0x5d7f93);
  }
  ["warn"](_0x265091) {
    this.logger.warn(_0x265091);
  }
  ["error"](_0x242215) {
    this.logger.error(_0x242215);
  }
  ['debug'](_0x9f18d1) {
    this.logger.debug(_0x9f18d1);
  }
  ['setLevel'](_0x421cd1) {
    this.logger.level = _0x421cd1;
  }
  ["clear"]() {
    _0x348a66.truncate("log/app.log", 0x0, _0x4b6a3c => {
      if (_0x4b6a3c) {
        this.logger.error("Failed to clear the log file: " + _0x4b6a3c.message);
      } else {
        this.logger.info("Log file cleared");
      }
    });
  }
}
const logger = new Logger();
export default logger;