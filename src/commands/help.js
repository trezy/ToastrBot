// Module imports
import emoji from 'node-emoji'





// Local imports
import splitDocsForDiscord from '../helpers/splitDocsForDiscord'





export default async messageData => {
  const {
    args,
    command,
    commands,
    defaultPrefix,
  } = messageData
  let docs = null
  let hint = null

  if (args) {
    const helpCommand = commands[emoji.unemojify(args)]

    if (!helpCommand) {
      const errorMessage = `Sorry, the \`${defaultPrefix}${args}\` command doesn't exist.`

      return {
        embed: {
          color: 'red',
          description: errorMessage,
        },
        say: errorMessage,
        success: false,
      }
    }

    docs = helpCommand.docs
    hint = helpCommand.getHint(messageData)
  } else {
    docs = command.docs
    hint = command.getHint(messageData)
  }

  const splitDocs = splitDocsForDiscord(docs)

  return {
    embed: splitDocs.map((docsPage, index, array) => {
      const embedObject = {
        color: 'blue',
        description: docsPage,
        fields: [],
        title: `\`${defaultPrefix}${args}\` Documentation`,
      }

      if (array.length > 1) {
        embedObject.footer = {
          text: `Page ${index + 1} of ${array.length}`,
        }
      }

      if (index === (array.length - 1)) {
        embedObject.fields.push({
          name: 'Usage',
          value: hint,
        })
      }

      return embedObject
    }),
    say: splitDocs,
    success: true,
  }
}
