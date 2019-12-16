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

  return {
    embed: {
      color: 'blue',
      fields: Object.values(commands).map(command => ({
        name: `\`${defaultPrefix}${escapeDiscordMarkdown(emoji.emojify(command.name))}\``,
        value: command.getDescription(messageData),
      })),
      title: 'Available Commands',
    },
    say: emoji.emojify(`This is a list of all available commands: ${getCommandList(commands)}.`),
    success: true,
  }
}
