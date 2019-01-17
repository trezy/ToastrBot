import config from '../config'





export default async ({ args, bot, channel, user }) => {
  const [action, commandName, ...commandMessage] = args.replace(',', '').split(' ')
  const response = { success: true }
  const channelPermissions = channel.permissions[commandName]

  const databaseRef = bot.database.ref(`${channel.safeName}/permissions`)

  switch (action) {
    case 'add':
      await databaseRef.child(commandName).set(Array.from(new Set([
        ...(channelPermissions || []),
        ...commandMessage,
      ])))
      break

    case 'list':
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

      response.say = `${user.atName}:`

      if (forkedPermissions.roles.length) {
        response.say += `To use \`${commandName}\`, you must have one of these roles: ${forkedPermissions.roles.join(', ')}. `
      }

      if (forkedPermissions.users.length) {
        response.say += `These users may ${forkedPermissions.roles.length ? 'also ' : ''}use \`${commandName}\`: ${forkedPermissions.users.join(', ')}.`
      }

      if (!forkedPermissions.roles.length && !forkedPermissions.users.length) {
        response.say += `The \`${commandName}\` command is available to anybody.`
      }
      break

    case 'remove':
      if (!channelPermissions) {
        response.success = false
        response.say = `${user.atName}: Command doesn't have any permissions set.`

        return response
      }

      await databaseRef.child(commandName).set(channelPermissions.filter(item => !commandMessage.includes(item)))

      break
  }

  return response
}
