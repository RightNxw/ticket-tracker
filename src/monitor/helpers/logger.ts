import winston, { Logger, format, transports } from "winston"

interface CustomLevels {
  levels: {
    [key: string]: number
  }
  colors: {
    [key: string]: string
  }
}

const myCustomLevels: CustomLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    queue: 3,
    debug: 4,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "grey",
    queue: "green",
    debug: "blue",
  },
}

winston.addColors(myCustomLevels.colors)

const logger: Logger = winston.createLogger({
  levels: myCustomLevels.levels,
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      (info) =>
        `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`
    )
  ),
  transports: [
    new transports.Console({
      level: "debug",
      format: format.combine(
        format.colorize({ all: true }),
        format.printf(
          (info) =>
            `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`
        )
      ),
    }),
    new transports.File({ filename: "combined.log" }),
  ],
})

export default logger
