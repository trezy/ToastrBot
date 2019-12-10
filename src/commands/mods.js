// Local imports
import convertArrayToStringList from '../helpers/convertArrayToStringList'





export default async ({ server, user }) => {
  const moderators = await server.getModerators()
  const moderatorsList = convertArrayToStringList(moderators, {
    transformer: ({ displayName }) => displayName,
  })

  return {
    say: `${user.atName}: The mods on this channel are ${moderatorsList}`,
    success: true,
  }
}
