export default async ({ args, bot, channel, commands, user }) => {
  const [, commandName, ...commandMessage] = args.split(' ')
  const command = commands[commandName]
  const databaseRef = bot.database.ref(`${channel.safeName}/commands`)
  let subaction = 'say'

  if (!commandName) {
    const modifiableCommands = Object.keys(commands).reduce((accumulator, commandNameToVerify) => {
      if (!commands[commandNameToVerify].isDefault) {
        accumulator.push(commandNameToVerify)
      }

      return accumulator
    }, [])

    return {
      say: `${user.atName}: \`${channel.defaultPrefix}command modify\` requires a command name. The options are: ${modifiableCommands.join(', ')}`,
      success: false,
    }
  }

  if (!commandMessage.length) {
    return {
      say: `${user.atName}: \`${channel.defaultPrefix}command modify\` requires a response to be posted when running \`${channel.defaultPrefix}${commandName}\`.`,
      success: false,
    }
  }

  if (!command) {
    return {
      say: `${user.atName}: \`${channel.defaultPrefix}${commandName}\` does not exist.`,
      success: false,
    }
  }

  if (command.isDefault) {
    return {
      say: `${user.atName}: Cannot modify default commands.`,
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
    say: `${user.atName}: I've updated \`${channel.defaultPrefix}${commandName}\` for you.`,
    success: true,
  }
}
