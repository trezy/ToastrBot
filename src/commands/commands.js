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
      fields: Object.values(commands).map(command => {
        const description = command.getDescription(messageData)
        const hint = command.getHint(messageData)

        let value = description

        if (hint) {
          value += `\n\n**Usage**:\n\`\`\`sh\n${hint}\`\`\`---`
        }

        return {
          name: `\`${defaultPrefix}${escapeDiscordMarkdown(emoji.emojify(command.name))}\``,
          value,
        }
      }),
      title: 'Available Commands',
    },
    say: emoji.emojify(`This is a list of all available commands: ${getCommandList(commands)}.`),
    success: true,
  }
}
