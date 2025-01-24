  import { createLogger, format, transports } from 'winston';
  import a12_0x23670f from 'fs';
  const {
    combine,
    timestamp,
    printf,
    colorize
  } = format;
  const customFormat = printf(({
    level: _0x22cbd6,
    message: _0xfa0c85,
    timestamp: _0x48c173
  }) => {
    return _0x48c173 + " [" + _0x22cbd6 + "]: " + _0xfa0c85;
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
    ['info'](_0x34ffef) {
      this.logger.info(_0x34ffef);
    }
    ["warn"](_0x54fc17) {
      this.logger.warn(_0x54fc17);
    }
    ["error"](_0x2290c5) {
      this.logger.error(_0x2290c5);
    }
    ["debug"](_0x6d0543) {
      this.logger.debug(_0x6d0543);
    }
    ["setLevel"](_0x2d7b48) {
      this.logger.level = _0x2d7b48;
    }
    ['clear']() {
      a12_0x23670f.truncate("log/app.log", 0x0, _0x284234 => {
        if (_0x284234) {
          this.logger.error("Failed to clear the log file: " + _0x284234.message);
        } else {
          this.logger.info("Log file cleared");
        }
      });
    }
  }
  const logger = new Logger();
  export default logger;