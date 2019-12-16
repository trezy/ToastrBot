// Module imports
import emoji from 'node-emoji'





// Local imports
import escapeDiscordMarkdown from '../helpers/escapeDiscordMarkdown'
import getCommandList from '../helpers/getCommandList'





export default messageData => {
  const {
    commands,
    defaultPrefix,
  } = messageData

  let embedObjects = Object.values(commands).reduce((accumulator, command, index, array) => {
    if ((index % 25) === 0) {
      accumulator.push({
        color: 'blue',
        fields: [],
        title: 'Available Commands',
      })
    }

    accumulator[accumulator.length - 1].fields.push({
      name: `\`${defaultPrefix}${escapeDiscordMarkdown(emoji.emojify(command.name))}\``,
      value: command.getDescription(messageData),
    })

    return accumulator
  }, [])


  if (embedObjects.length > 1) {
    embedObjects = embedObjects.map((embedObject, index, array) => ({
      ...embedObject,
      footer: {
        text: `Page ${index + 1} of ${array.length}`
      },
    }))
  }

  return {
    embed: embedObjects,
    say: emoji.emojify(`This is a list of all available commands: ${getCommandList(commands)}.`),
    success: true,
  }
}
