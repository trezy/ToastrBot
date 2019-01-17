export default async ({ args, bot, channel, commands, user }) => {
  const [action, commandName, ...commandMessage] = args.split(' ')
  const response = { success: true }
  let subaction = 'say'

  const databaseRef = bot.database.ref(`${channel.safeName}/commands`)

  const command = commands[commandName]

  switch (action) {
    case 'add':
      if (command) {
        response.success = false
        response.say = `${user.atName}: Command already exists. Try \`${channel.prefix[0]}command modify <command>\` instead.`
        return response
      }

      if (['action', 'say'].includes(commandMessage[0])) {
        subaction = commandMessage.shift()
      }

      await databaseRef.child(commandName).set({
        [subaction]: commandMessage.join(' '),
        name: commandName,
      })

      break

    case 'modify':
      if (!command) {
        response.success = false
        response.say = `${user.atName}: Command does not exist.`

        return response
      }

      if (command.isDefault) {
        response.success = false
        response.say = `${user.atName}: Cannot modify default commands.`

        return response
      }

      if (['action', 'say'].includes(commandMessage[0])) {
        subaction = commandMessage.shift()
      }

      await databaseRef.child(commandName).set({
        [subaction]: commandMessage.join(' '),
        name: commandName,
      })

      break

    case 'remove':
      if (!command) {
        response.success = false
        response.say = `${user.atName}: Command does not exist.`

        return response
      }

      if (command.isDefault) {
        response.success = false
        response.say = `${user.atName}: Cannot remove default commands.`

        return response
      }

      await databaseRef.child(commandName).remove()

      break
  }

  return response
}
