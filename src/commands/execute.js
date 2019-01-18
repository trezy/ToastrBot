// Module imports
import path from 'path'





// Local imports
import getFilesByType from '../helpers/getFilesByType'





export default async options => {
  const {
    args,
    user,
  } = options
  const [subcommand] = args.split(' ')
  const subcommands = getFilesByType('.js', path.resolve(__dirname, 'execute'))

  if (subcommands[subcommand]) {
    return subcommands[subcommand](options)
  }

  return {
    say: `${user.atName}: \`execute\` requires an action. The options are: ${Object.keys(subcommands).join(', ')}`,
    success: false,
  }
}
