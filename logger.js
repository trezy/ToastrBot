const {
  createLogger,
  format,
  transports,
} = require('winston')
const {
  combine: combineFormat,
  json: jsonFormat,
  // label: formatLabel,
  timestamp: timestampFormat,
} = format
const {
  Console: ConsoleTransport,
  File: FileTransport,
} = transports





function excludeLevels (levelsToExclude) {
  return (format(info => {
    if (levelsToExclude.includes(info.level)) {
      return false
    }

    return info
  }))()
}





const logger = createLogger({
  level: (process.env.NODE_ENV === 'production') ? 'info' : 'silly',
  format: combineFormat(timestampFormat(), jsonFormat()),
  defaultMeta: {
    // service: 'user-service',
  },
  transports: [
    new FileTransport({
      filename: 'error.log',
      level: 'warn',
    }),
    new FileTransport({
      format: combineFormat(excludeLevels(['error', 'warn']), timestampFormat(), jsonFormat()),
      filename: 'info.log',
    }),
    new ConsoleTransport(),
  ]
})





module.exports = logger
