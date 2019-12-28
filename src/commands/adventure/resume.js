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
    response.description = 'You are not currently involved in any adventures.'
    success = false
  } else {
    const adventureDoc = adventuresSnapshot._docs()[0]
    const adventure = {
      ...adventureDoc.data(),
      id: adventureDoc.id,
    }

    const story = Story.get(adventure.story)
    const page = story.pagesByID[adventure.currentPage]

    response.color = `green`
    response.description = page.body
    response.footer = { text: `ID: ${adventure.id}` }
    response.title = page.name
  }

  return {
    embed: response,
    say: '...is out there!',
    success,
  }
}
