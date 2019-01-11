const {
  createLogger,
  format,
  transports,
} = require('winston')
require('winston-daily-rotate-file')
const {
  combine: combineFormat,
  json: jsonFormat,
  // label: formatLabel,
  timestamp: timestampFormat,
} = format
const {
  Console: ConsoleTransport,
  DailyRotateFile: DailyRotateFileTransport,
} = transports





function excludeLevels (levelsToExclude) {
  return (format(info => {
    if (levelsToExclude.includes(info.level)) {
      return false
    }

    return info
  }))()
}





const fileTransportDefaultOptions = {
  dirname: 'logs',
  maxSize: '20m',
  zippedArchive: true,
}





const logger = createLogger({
  level: (process.env.NODE_ENV === 'production') ? 'info' : 'silly',
  format: combineFormat(timestampFormat(), jsonFormat()),
  transports: [
    new DailyRotateFileTransport({
      ...fileTransportDefaultOptions,
      filename: '%DATE%-error.log',
      level: 'warn',
    }),
    new DailyRotateFileTransport({
      ...fileTransportDefaultOptions,
      format: combineFormat(excludeLevels(['error', 'warn']), timestampFormat(), jsonFormat()),
      filename: '%DATE%-info.log',
    }),
    new ConsoleTransport(),
  ]
})





module.exports = logger
