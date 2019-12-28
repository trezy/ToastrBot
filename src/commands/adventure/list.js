// Local imports
import convertArrayToStringList from '../../helpers/convertArrayToStringList'





export default async messageData => {
  const { server } = messageData

  const options = []
  const response = {
    color: 'blue',
    fields: options,
    title: 'Adventure Is Out There!',
  }
  const adventuresCollection = server.firestore.collection('adventures')
  const adventuresQuery = adventuresCollection.where('serverID', '==', server.id)
  const adventuresSnapshot = await adventuresQuery.get()

  if (adventuresSnapshot.empty) {
    response.footer = { text: 'There are no current adventures on this server.' }
  } else {
    adventuresSnapshot.forEach(doc => {
      const data = {
        ...doc.data(),
        id: doc.id,
      }
      const fields = ['id', 'seed']
      const adventurers = convertArrayToStringList(data.adventurerIDs.map(id => {
        return server.users[id].displayName
      }))

      options.push({
        name: data.story,
        value: `_Adventurers:_ ${adventurers}\n_ID:_ ${data.id}`,
      })
    })
  }

  return {
    embed: response,
    say: '...is out there!',
    success: true,
  }
}
