// Modules imports
import fs from 'fs'
import path from 'path'





// Local imports
import getFilenamesByType from './getFilenamesByType'





export default function (fileType, filePath) {
  const filenames = getFilenamesByType(fileType, filePath)

  return filenames.reduce((accumulator, filename) => ({
    ...accumulator,
    [filename]: require(path.resolve(filePath, filename)).default,
  }), {})
}
