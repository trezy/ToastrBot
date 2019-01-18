// Modules imports
import path from 'path'





// Local imports
import Command from '../structures/Command'
import getFilesByType from '../helpers/getFilesByType'





export default function ({ firebase, twitch }) {
  const commands = getFilesByType('.js', path.resolve(__dirname, '..', 'commands'))

  for (const [commandName, commandFunction] of Object.entries(commands)) {
    commands[commandName] = new Command({
      firebase,
      name: commandName,
      twitch,
    }, commandFunction)
  }

  return commands
}
