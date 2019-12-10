// Loal imports
import convertArrayToStringList from '../../helpers/convertArrayToStringList'
import getCommandList from '../../helpers/getCommandList'
import getUnmentionableList from '../../helpers/getUnmentionableList'





export default async messageData => {
  const {
    args,
    bot,
    commands,
    defaultPrefix,
    server,
    user,
  } = messageData
  const { permissionsCollection } = server
  const [, commandName, ...commandMessage] = args.replace(', ', ',').split(' ')
  const commandPermissions = server.permissions[commandName]
  const command = commands[commandName]

  if (!commandName) {
    return {
      say: `${user.atName}: \`${defaultPrefix}perms remove\` requires a command name. The options are: ${getCommandList(commands)}.`,
      success: false,
    }
  }

  if (!command) {
    return {
      say: `${user.atName}: \`${defaultPrefix}${commandName}\` does not exist.`,
      success: false,
    }
  }

  if (!commandPermissions) {
    return {
      say: `${user.atName}: Command doesn't have any permissions set.`,
      success: false,
    }
  }

  if (!commandMessage.length) {
    return {
      say: `${user.atName}: \`${defaultPrefix}perms remove\` requires a comma-separated list of permission levels to remove from a command. You can give me a username, as well. Use \`${defaultPrefix}perms list ${commandName}\` to see who currently has permission to use this command.`,
      success: false,
    }
  }

  await permissionsCollection.doc(commandName).set({
    permissions: bot.firebase.firestore.FieldValue.arrayRemove(...commandMessage),
  })

  return {
    say: `${user.atName}: I've removed permission to use \`${defaultPrefix}${commandName}\` from ${getUnmentionableList(commandMessage)}.`,
    success: true,
  }
}
