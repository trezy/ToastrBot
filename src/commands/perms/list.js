// Loal imports
import getCommandList from '../../helpers/getCommandList'
import getUnmentionableList from '../../helpers/getUnmentionableList'





export default async messageData => {
  const {
    args,
    channel,
    commands,
    defaultPrefix,
    server,
    user,
  } = messageData
  const [, commandName] = args.replace(',', '').split(' ')
  const command = commands[commandName]
  const commandPermissions = server.permissions[commandName]

  if (!commandName) {
    return {
      say: `${user.atName}: \`${defaultPrefix}perms list\` requires a command name. The options are: ${getCommandList(commands)}.`,
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
      success: true,
    }
  }

  const response = {
    say: `${user.atName}: `,
    success: true,
  }
  const forkedPermissions = commandPermissions.reduce((accumulator, item) => {
    let destinationArray = 'users'

    if (item.startsWith('&')) {
      destinationArray = 'roles'
    }

    accumulator[destinationArray].push(`<@${item}>`)

    return accumulator
  }, {
    roles: [],
    users: [],
  })

  if (forkedPermissions.roles.length) {
    response.say += `To use \`${defaultPrefix}${commandName}\`, you must have one of these roles: ${getUnmentionableList(forkedPermissions.roles)}. `
  }

  if (forkedPermissions.users.length) {
    response.say += `These users may ${forkedPermissions.roles.length ? 'also ' : ''}use \`${defaultPrefix}${commandName}\`: ${getUnmentionableList(forkedPermissions.users)}.`
  }

  if (!forkedPermissions.roles.length && !forkedPermissions.users.length) {
    response.say += `\`${defaultPrefix}${commandName}\` is available to anybody.`
  }

  return response
}
