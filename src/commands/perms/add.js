import config from '../../config'
import convertArrayToStringList from '../../helpers/convertArrayToStringList'





export default async ({ args, bot, channel, commands, user }) => {
  const [, commandName, ...commandMessage] = args.replace(',', '').split(' ')
  const channelPermissions = channel.permissions[commandName]
  const command = commands[commandName]
  const databaseRef = bot.database.ref(`${channel.safeName}/permissions`)

  if (!commandName) {
    return {
      say: `${user.atName}: \`${channel.defaultPrefix}perms add\` requires a command name. The options are: ${convertArrayToStringList(Object.keys(commands), 'or')}.`,
      success: false,
    }
  }

  if (!command) {
    return {
      say: `${user.atName}: \`${channel.defaultPrefix}${commandName}\` does not exist.`,
      success: false,
    }
  }

  if (!commandMessage.length) {
    return {
      say: `${user.atName}: \`${channel.defaultPrefix}perms add\` requires a comma-separated list of permission levels to add to a command. You can give me a username, as well. The permission levels available are: ${convertArrayToStringList(config.roles)}.`,
      success: false,
    }
  }

  await databaseRef.child(commandName).set(Array.from(new Set([
    ...(channelPermissions || []),
    ...commandMessage,
  ])))

  return {
    say: `${user.atName}: I've given ${convertArrayToStringList(commandMessage)} permission to use \`${channel.defaultPrefix}${commandName}\`.`,
    success: true,
  }
}
