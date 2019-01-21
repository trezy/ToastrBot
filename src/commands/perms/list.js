import config from '../../config'
import convertArrayToStringList from '../../helpers/convertArrayToStringList'





export default async ({ args, channel, commands, user }) => {
  const [, commandName] = args.replace(',', '').split(' ')
  const channelPermissions = channel.permissions[commandName]
  const command = commands[commandName]

  if (!commandName) {
    return {
      say: `${user.atName}: \`${channel.defaultPrefix}perms list\` requires a command name. The options are: ${convertArrayToStringList(Object.keys(commands), 'or')}.`,
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
      success: true,
    }
  }

  const response = {
    say: `${user.atName}: `,
    success: true,
  }
  const forkedPermissions = channelPermissions.reduce((accumulator, item) => {
    if (config.roles.includes(item)) {
      accumulator.roles.push(item)
    } else {
      accumulator.users.push(item)
    }

    return accumulator
  }, {
    roles: [],
    users: [],
  })

  if (forkedPermissions.roles.length) {
    response.say += `To use \`${channel.defaultPrefix}${commandName}\`, you must have one of these roles: ${convertArrayToStringList(forkedPermissions.roles, 'or')}. `
  }

  if (forkedPermissions.users.length) {
    response.say += `These users may ${forkedPermissions.roles.length ? 'also ' : ''}use \`${channel.defaultPrefix}${commandName}\`: ${convertArrayToStringList(forkedPermissions.users)}.`
  }

  if (!forkedPermissions.roles.length && !forkedPermissions.users.length) {
    response.say += `\`${channel.defaultPrefix}${commandName}\` is available to anybody.`
  }

  return response
}
