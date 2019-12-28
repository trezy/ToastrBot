// Module imports
import emoji from 'node-emoji'





export default async messageData => {
  const {
    server,
    user,
  } = messageData
  const response = {
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

    if (!adventure.locked) {
      response.description = `_${adventure.story}_ is already unlocked.`
      success = false
    } else {
      adventuresCollection.doc(adventureDoc.id).update({ locked: false })

      response.color = 'green'
      response.description = `You have unlocked _${adventure.story}_. Anybody can now join this adventure.`
      response.footer = { text: `ID: ${adventure.id}.` }
    }
  }

  return {
    embed: response,
    success,
  }
}
