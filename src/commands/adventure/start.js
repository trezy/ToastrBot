// Module imports
import path from 'path'





// Local imports
import getFilenamesByType from '../../helpers/getFilenamesByType'
import Story from '../../structures/adventure/Story'





export default async messageData => {
  const {
    args,
    defaultPrefix,
    server,
    user,
  } = messageData
  const options = []
  const title = /^\w+ (.*)/.exec(args)?.[1]
  const stories = getFilenamesByType('.html', path.resolve(__dirname, '..', '..', 'stories'))
  const response = {
    fields: options,
    title: 'Adventure Is Out There!',
  }

  const adventuresCollection = server.firestore.collection('adventures')
  const adventuresQuery = adventuresCollection.where('serverID', '==', server.id).where('adventurerIDs', 'array-contains', user.id)
  const adventuresSnapshot = await adventuresQuery.get()
  let success = true

  if (adventuresSnapshot.empty) {
    if (title) {
      const story = Story.get(title)
      const page = story.pagesByID[story.startNode]

      const adventureDoc = await server.firestore.collection('adventures').add({
        adventurerIDs: [user.id],
        currentPage: story.startNode,
        locked: true,
        seed: Math.random().toString().replace(/^0\./, ''),
        serverID: server.id,
        state: { ...page.variables.set },
        story: title,
      })

      response.color = `green`
      response.description = page.body
      response.footer = { text: `ID: ${adventureDoc.id}` }
      response.title = page.name
    } else {
      response.color = 'red'
      response.description = `You must select a story to start an adventure. Here are the currently available stories:`
      success = false

      stories.forEach(story => {
        options.push({
          name: story,
          value: 'It\'s a story!',
        })
      })
    }
  } else {
    response.color = 'red'
    response.description = `Sorry, you can only be on one adventure at a time. You can always leave your current adventure using \`${defaultPrefix}adventure leave\`.`
    success = false
  }

  return {
    embed: response,
    say: '...is out there!',
    success,
  }
}
