// Module imports
import path from 'path'





// Local imports
import getCommandList from '../helpers/getCommandList'
import getFilesByType from '../helpers/getFilesByType'





export default async options => {
  const {
    args,
    defaultPrefix,
    user,
  } = options
  const [subcommand] = args.split(' ')
  const subcommands = getFilesByType('.js', path.resolve(__dirname, 'execute'))

  if (subcommands[subcommand]) {
    return subcommands[subcommand](options)
  }

  return {
    say: `${user.atName}: \`${defaultPrefix}execute\` requires an action. The options are: ${getCommandList(subcommands)}.`,
    success: false,
  }
}
