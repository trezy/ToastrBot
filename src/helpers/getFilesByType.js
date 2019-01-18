// Modules imports
import fs from 'fs'
import path from 'path'





export default function (fileType, filePath) {
  const fileExtension = fileType.replace(/^\./, '')
  const fileRegex = new RegExp(`\.${fileExtension}$`)

  return fs.readdirSync(filePath).reduce((accumulator, filename) => {
    if (fileRegex.test(filename)) {
      const commandName = filename.replace(fileRegex, '')

      accumulator[commandName] = require(path.resolve(filePath, filename)).default
    }

    return accumulator
  }, {})
}
