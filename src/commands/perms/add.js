// Local imports
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
  const [, commandName, ...commandMessage] = args.replace(',', '').split(' ')
  const command = commands[commandName]

  if (!commandName) {
    return {
      say: `${user.atName}: \`${defaultPrefix}perms add\` requires a command name. The options are: ${getCommandList(commands)}.`,
      success: false,
    }
  }

  if (!command) {
    return {
      say: `${user.atName}: \`${defaultPrefix}${commandName}\` does not exist.`,
      success: false,
    }
  }

  if (!commandMessage.length) {
    return {
      say: `${user.atName}: \`${defaultPrefix}perms add\` requires a comma-separated list of permission levels to add to a command. You can give me a username, as well. The permission levels available are: ${getUnmentionableList(server.rolesList)}.`,
      success: false,
    }
  }

  const permissionIDs = commandMessage.map(item => {
    return item.replace(/<@(&?\d+)>/, '$1')
  })

  await permissionsCollection.doc(commandName).set({
    permissions: bot.firebase.firestore.FieldValue.arrayUnion(...permissionIDs),
  })

  return {
    say: `${user.atName}: ${convertArrayToStringList(commandMessage)} now have permission to use \`${defaultPrefix}${commandName}\`.`,
    success: true,
  }
}
