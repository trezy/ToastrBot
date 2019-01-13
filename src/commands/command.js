export default async ({ args, bot, channel, commands, userstate }, firebase) => {
  const [action, commandName, ...commandMessage] = args.split(' ')
  const response = { success: true }
  const username = `@${userstate['display-name']}`
  let subaction = 'say'

  const databaseRef = bot.database.ref(`${channel.replace(/^#/, '')}/commands`)

  const command = commands[commandName] || bot.getChannel(channel).commands[commandName]

  switch (action) {
    case 'add':
      if (command) {
        response.success = false
        response.say = `${username}: Command already exists. Try \`!command modify <command>\` instead.`
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
        response.say = `${username}: Command does not exist.`

        return response
      }

      if (command.isDefault) {
        response.success = false
        response.say = `${username}: Cannot modify default commands.`

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
        response.say = `${username}: Command does not exist.`

        return response
      }

      if (command.isDefault) {
        response.success = false
        response.say = `${username}: Cannot remove default commands.`

        return response
      }

      await databaseRef.child(commandName).remove()

      break
  }

  return response
}
