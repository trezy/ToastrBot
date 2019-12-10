// Module imports
import emoji from 'node-emoji'





// Local imports
import getCommandList from '../../helpers/getCommandList'





export default async messageData => {
  const {
    args,
    bot,
    commands,
    defaultPrefix,
    server,
    user,
  } = messageData
  const { commandsCollection } = server
  const [, commandName, ...commandMessage] = args.split(' ')
  const escapedCommandName = emoji.unemojify(commandName)
  const command = commands[escapedCommandName]
  let subaction = 'say'

  if (!commandName) {
    const modifiableCommands = Object.keys(commands).reduce((accumulator, commandNameToVerify) => {
      if (!commands[commandNameToVerify].isDefault) {
        accumulator.push(commandNameToVerify)
      }

      return accumulator
    }, [])


    return {
      say: `${user.atName}: \`${defaultPrefix}command modify\` requires a command name. The options are: ${getCommandList(modifiableCommands)}`,
      success: false,
    }
  }

  if (!commandMessage.length) {
    return {
      say: `${user.atName}: \`${defaultPrefix}command modify\` requires a response to be posted when running \`${defaultPrefix}${commandName}\`.`,
      success: false,
    }
  }

  if (!command) {
    return {
      say: `${user.atName}: \`${defaultPrefix}${commandName}\` does not exist.`,
      success: false,
    }
  }

  if (command.isDefault) {
    return {
      say: `${user.atName}: Cannot modify default commands.`,
      success: false,
    }
  }

  if (['action', 'say'].includes(commandMessage[0])) {
    subaction = commandMessage.shift()
  }

  await commandsCollection.doc(command.id).update({ [subaction]: commandMessage.join(' ') })

  return {
    say: `${user.atName}: I've updated \`${defaultPrefix}${commandName}\` for you.`,
    success: true,
  }
}
