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

    adventuresCollection.doc(adventure.id).update({
      adventurerIDs: server.firebase.firestore.FieldValue.arrayRemove(user.id)
    })

    response.color = 'green'
    response.description = `You have left _${adventure.story}_.`
    response.footer = { text: `ID: ${adventure.id}.` }
  }

  return {
    embed: response,
    success,
  }
}
