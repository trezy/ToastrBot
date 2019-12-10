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
  const [, commandName] = args.split(' ')
  const command = commands[commandName]

  if (!commandName) {
    const removableCommands = Object.keys(commands).reduce((accumulator, commandNameToVerify) => {
      if (!commands[commandNameToVerify].isDefault) {
        accumulator.push(commandNameToVerify)
      }

      return accumulator
    }, [])

    return {
      say: `${user.atName}: \`${defaultPrefix}command remove\` requires a command name. The options are: ${getCommandList(removableCommands)}`,
      success: false,
    }
  }

  if (!command) {
    return {
      say: `${user.atName}: Command does not exist.`,
      success: false,
    }
  }

  if (command.isDefault) {
    return {
      say: `${user.atName}: Cannot remove default commands.`,
      success: false,
    }
  }

  await commandsCollection.doc(command.id).delete()

  return {
    say: `${user.atName}: I've removed \`${defaultPrefix}${commandName}\` for you.`,
    success: true,
  }
}
