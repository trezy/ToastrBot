// Module imports
import emoji from 'node-emoji'





// Local constants
const commandNameValidationRegex = /^[\w-]*$/u





export default async messageData => {
  const {
    args,
    bot,
    commands,
    defaultPrefix,
    server,
    user,
  } = messageData
  const { commandsCollection } = server
  const [, commandName, ...commandMessage] = args.split(' ')
  const escapedCommandName = emoji.unemojify(commandName)
  const command = commands[escapedCommandName]
  let subaction = 'say'

  if (!commandName) {
    return {
      say: `${user.atName}: \`${defaultPrefix}command add\` requires a command name.`,
      success: false,
    }
  }

  if (!commandNameValidationRegex.test(commandName)) {
    return {
      say: `${user.atName}: \`${defaultPrefix}${commandName}\` is an invalid command name. Command names may only contain letters, numbers, and hyphens.`,
      success: false,
    }
  }

  if (!commandMessage.length) {
    return {
      say: `${user.atName}: \`${defaultPrefix}command add\` requires a response to be posted when running \`${defaultPrefix}${commandName}\`.`,
      success: false,
    }
  }

  if (command) {
    return {
      say: `${user.atName}: Command already exists. If you're trying to update this command, try \`${defaultPrefix}command modify ${commandName}\` instead.`,
      success: false,
    }
  }

  if (['action', 'say'].includes(commandMessage[0])) {
    subaction = commandMessage.shift()
  }

  await commandsCollection.add({
    [subaction]: commandMessage.join(' '),
    name: escapedCommandName,
  })

  return {
    say: `${user.atName}: I've added \`${defaultPrefix}${commandName}\` for you.`,
    success: true,
  }
}
