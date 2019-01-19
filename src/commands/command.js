// Module imports
import path from 'path'





// Local imports
import getFilesByType from '../helpers/getFilesByType'





export default async options => {
  const {
    args,
    channel,
    user,
  } = options
  const [subcommand] = args.split(' ')
  const subcommands = getFilesByType('.js', path.resolve(__dirname, 'command'))

  if (subcommands[subcommand]) {
    return subcommands[subcommand](options)
  }

  return {
    say: `${user.atName}: \`${channel.defaultPrefix}command\` requires an action. The options are: ${Object.keys(subcommands).join(', ')}`,
    success: false,
  }
}
