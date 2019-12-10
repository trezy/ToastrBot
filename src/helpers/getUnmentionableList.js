// Local imports
import convertArrayToStringList from './convertArrayToStringList'





export default mentionables => {
  return convertArrayToStringList(mentionables, {
    combinator: 'or',
    transformer: item => item.replace(/@/g, '@\u200b'),
  })
}
