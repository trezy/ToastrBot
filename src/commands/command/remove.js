export default async ({ args, bot, channel, commands, user }) => {
  const [, commandName] = args.split(' ')
  const databaseRef = bot.database.ref(`${channel.safeName}/commands`)
  const command = commands[commandName]

  if (!commandName) {
    const removableCommands = Object.keys(commands).reduce((accumulator, commandNameToVerify) => {
      if (!commands[commandNameToVerify].isDefault) {
        accumulator.push(commandNameToVerify)
      }

      return accumulator
    }, [])

    return {
      say: `${user.atName}: \`${channel.defaultPrefix}command remove\` requires a command name. The options are: ${removableCommands.join(', ')}`,
      success: false,
    }
  }

  if (!command) {
    return {
      say: `${user.atName}: Command does not exist.`,
      success: false,
    }
  }

  if (command.isDefault) {
    return {
      say: `${user.atName}: Cannot remove default commands.`,
      success: false,
    }
  }

  await databaseRef.child(commandName).remove()

  return {
    say: `${user.atName}: I've removed \`${channel.defaultPrefix}${commandName}\` for you.`,
    success: true,
  }
}
