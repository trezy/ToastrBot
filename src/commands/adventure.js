// Module imports
import emoji from 'node-emoji'
import path from 'path'





// Local imports
import escapeDiscordMarkdown from '../helpers/escapeDiscordMarkdown'
import getFilesByType from '../helpers/getFilesByType'
import Story from '../structures/adventure/Story'





export default async messageData => {
  const {
    args,
    commands,
    defaultPrefix,
    server,
    user,
  } = messageData
  const options = []
  const response = {
    title: 'Adventure Is Out There!',
  }
  const [subcommand] = args.split(' ')
  const subcommands = getFilesByType('.js', path.resolve(__dirname, 'adventure'))
  const adventuresCollection = server.firestore.collection('adventures')
  const adventuresQuery = adventuresCollection.where('serverID', '==', server.id).where('adventurerIDs', 'array-contains', user.id)
  const adventuresSnapshot = await adventuresQuery.get()

  if (!args || adventuresSnapshot.empty) {
    if (subcommands[subcommand]) {
      return subcommands[subcommand](messageData)
    }

    response.description = `Welcome to _Adventure is Out There!_, a text-based adventure system from Trezy Studios! It doesn't look like you're currently involved in any adventures. If this is your first time playing, make sure to use \`${defaultPrefix}help adventure\` to learn more about how to play!`
  } else {
    const adventureDoc = adventuresSnapshot._docs()[0]
    const adventure = {
      ...adventureDoc.data(),
      id: adventureDoc.id,
    }

    const story = Story.get(adventure.story)
    const currentPage = story.getPage(adventure.currentPage)
    const nextPage = story.getPage(currentPage.getLink(args))

    if (nextPage) {
      const updates = {
        currentPage: nextPage.id,
        state: {
          ...adventure.state,
          ...nextPage.variables.set,
        },
      }

      nextPage.variables.unset.forEach((name) => {
        delete updates.state[name]
      })

      adventuresCollection.doc(adventure.id).update(updates)

      response.color = `green`
      response.description = nextPage.body
      response.footer = { text: `ID: ${adventure.id}` }
      response.title = nextPage.name
    } else if (subcommands[subcommand]) {
      return subcommands[subcommand](messageData)
    }
  }


  return {
    embed: response,
    say: '...is out there!',
    success: true,
  }
}
