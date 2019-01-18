// Modules imports
import fs from 'fs'
import path from 'path'





// Local imports
import Command from '../structures/Command'





export default function ({ firebase, twitch }) {
  const commandsDirectoryContents = fs.readdirSync(path.resolve(__dirname, '..', 'commands'))

  return commandsDirectoryContents.reduce((accumulator, filename) => {
    if (/\.js$/.test(filename)) {
      const commandName = filename.replace(/\.js$/, '')

      accumulator[commandName] = new Command({
        firebase,
        name: commandName,
        twitch,
      })
    }

    return accumulator
  }, {})
}
