// Local imports
import convertArrayToStringList from './convertArrayToStringList'
import escapeDiscordMarkdown from './escapeDiscordMarkdown'





export default subcommandsObject => {
  let subcommandKeys = subcommandsObject

  if (!Array.isArray(subcommandsObject)) {
    subcommandKeys = Object.keys(subcommandsObject)
  }

  return convertArrayToStringList(subcommandKeys, {
    combinator: 'or',
    transformer: item => `\`${escapeDiscordMarkdown(item)}\``,
  })
}
