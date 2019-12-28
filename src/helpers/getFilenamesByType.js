// Modules imports
import fs from 'fs'





export default function (fileType, filePath) {
  const fileExtension = fileType.replace(/^\./, '')
  const fileRegex = new RegExp(`\.${fileExtension}$`)

  return fs.readdirSync(filePath).reduce((accumulator, filename) => {
    if (fileRegex.test(filename)) {
      accumulator.push(filename.replace(fileRegex, ''))
    }

    return accumulator
  }, [])
}
