export default async messageData => {
  const {
    args,
    defaultPrefix,
    server,
    user,
  } = messageData
  const response = {
    title: 'Adventure Is Out There!',
  }
  const [, adventureID] = args.split(' ')
  const adventuresCollection = server.firestore.collection('adventures')
  const adventureDoc = adventuresCollection.doc(adventureID)
  const adventureSnapshot = await adventureDoc.get()
  let success = true

  if (adventureSnapshot.exists) {
    const adventure = adventureSnapshot.data()

    if (adventure.adventurerIDs.includes(user.id)) {
      response.description = `You are already a part of _${adventure.story}_.`
      success = false
    } else if (adventure.locked) {
      response.description = `_${adventure.story}_ is currently locked and cannot be joined.`
      success = false
    } else {
      await adventureDoc.update({
        adventurerIDs: server.firebase.firestore.FieldValue.arrayUnion(user.id)
      })

      await adventureDoc.collection('adventurers').doc(user.id).set({
        ancestry: null,
        class: null,
        hitPoints: 1,
        gold: 0,
        level: 0,
      })

      response.color = 'green'
      response.description = `${user.displayName} has joined _${adventure.story}_!`// Make sure to set your class with \`${defaultPrefix}adventure class <class>\` and your ancestry with \`${defaultPrefix}adventure ancestry <ancestry>\``
    }
  } else {
    response.description = 'No adventure exists with that ID.'
    success = false
  }

  return {
    embed: response,
    say: '...is out there!',
    success,
  }
}
