export default async ({ args, bot, channel, commands, user }) => {
  const [, commandName, ...commandMessage] = args.split(' ')
  const databaseRef = bot.database.ref(`${channel.safeName}/commands`)
  const command = commands[commandName]
  let subaction = 'say'

  if (!commandName) {
    return {
      say: `${user.atName}: \`${channel.defaultPrefix}command add\` requires a command name.`,
      success: false,
    }
  }

  if (!commandMessage.length) {
    return {
      say: `${user.atName}: \`${channel.defaultPrefix}command add\` requires a response to be posted when running \`${channel.defaultPrefix}${commandName}\`.`,
      success: false,
    }
  }

  if (command) {
    return {
      say: `${user.atName}: Command already exists. If you're trying to update this command, try \`${channel.defaultPrefix}command modify ${commandName}\` instead.`,
      success: false,
    }
  }

  if (['action', 'say'].includes(commandMessage[0])) {
    subaction = commandMessage.shift()
  }

  await databaseRef.child(commandName).set({
    [subaction]: commandMessage.join(' '),
    name: commandName,
  })

  return {
    say: `${user.atName}: I've added \`${channel.defaultPrefix}${commandName}\` for you.`,
    success: true,
  }
}
