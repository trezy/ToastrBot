module.exports = async function ({ args, channel, commands, userstate }, firebaseAdmin) {
  const [action, commandName, ...commandMessage] = args.split(' ')
  const response = { success: true }
  const safeChannelName = channel.replace(/^#/, '')
  const username = `@${userstate['display-name']}`
  let subaction = 'say'

  const databaseRef = firebaseAdmin.database().ref(`${channel.replace(/^#/, '')}/commands`)

  const command = commands[commandName] || commands.channels[safeChannelName][commandName]

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

      databaseRef.child(commandName).set({
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

      if (command.default) {
        response.success = false
        response.say = `${username}: Cannot modify default commands.`

        return response
      }

      if (['action', 'say'].includes(commandMessage[0])) {
        subaction = commandMessage.shift()
      }

      command = () => ({
        [subaction]: commandMessage.join(' ')
      })

      break

    case 'remove':
      if (!command) {
        response.success = false
        response.say = `${username}: Command does not exist.`

        return response
      }

      if (command.default) {
        response.success = false
        response.say = `${username}: Cannot remove default commands.`

        return response
      }

      if (command.remote) {
        await databaseRef.child(commandName).remove()
      } else {
        delete command
      }

      break
  }

  return response
}
