export default (string, server) => {
  const matches = [...string.matchAll(/<(?:@[!&])?#?(\d+)>/u)]

  return matches.reduce((accumulator, [discordVariable, id]) => {
    let sourceDictionary = null

    if (discordVariable.startsWith('<@!')) {
      sourceDictionary = 'users'
    } else if (discordVariable.startsWith('<@&')) {
      sourceDictionary = 'roles'
    } else if (discordVariable.startsWith('<#')) {
      sourceDictionary = 'channels'
    }

    accumulator[discordVariable] = server[sourceDictionary][id]

    return accumulator
  }, {})
}
