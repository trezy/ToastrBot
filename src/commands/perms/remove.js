import convertArrayToStringList from '../../helpers/convertArrayToStringList'





export default async ({ args, bot, channel, commands, user }) => {
  const [, commandName, ...commandMessage] = args.replace(', ', ',').split(' ')
  const channelPermissions = channel.permissions[commandName]
  const command = commands[commandName]
  const databaseRef = bot.database.ref(`${channel.safeName}/permissions`)

  if (!commandName) {
    return {
      say: `${user.atName}: \`${channel.defaultPrefix}perms remove\` requires a command name. The options are: ${convertArrayToStringList(Object.keys(commands), 'or')}.`,
      success: false,
    }
  }

  if (!command) {
    return {
      say: `${user.atName}: \`${channel.defaultPrefix}${commandName}\` does not exist.`,
      success: false,
    }
  }

  if (!channelPermissions) {
    return {
      say: `${user.atName}: Command doesn't have any permissions set.`,
      success: false,
    }
  }

  if (!commandMessage.length) {
    return {
      say: `${user.atName}: \`${channel.defaultPrefix}perms remove\` requires a comma-separated list of permission levels to remove from a command. You can give me a username, as well. Use \`${channel.defaultPrefix}perms list ${commandName}\` to see who currently has permission to use this command.`,
      success: false,
    }
  }

  await databaseRef.child(commandName).set(channelPermissions.filter(item => !commandMessage.includes(item)))

  return {
    say: `${user.atName}: I've removed permission to use \`${channel.defaultPrefix}${commandName}\` from ${convertArrayToStringList(commandMessage)}.`,
    success: true,
  }
}
