// Local imports
import convertArrayToStringList from './convertArrayToStringList'





export default subcommandsObject => {
  let subcommandKeys = subcommandsObject

  if (!Array.isArray(subcommandsObject)) {
    subcommandKeys = Object.keys(subcommandsObject)
  }

  return convertArrayToStringList(subcommandKeys, {
    combinator: 'or',
    transformer: item => `\`${item.replace(/([|`>~_\*])/g, '\$1')}\``,
  })
}
