// Module imports
import path from 'path'





// Local imports
import getCommandList from '../../helpers/getCommandList'
import getFilesByType from '../../helpers/getFilesByType'





export default options => {
  const {
    args,
    user,
  } = options
  const [, subcommand] = /order (\d+)/.exec(args) || []
  const subcommands = getFilesByType('.js', path.resolve(__dirname, 'order'))

  if (subcommands[subcommand]) {
    return subcommands[subcommand](options)
  }

  return {
    say: `${user.atName}: \`execute order\` requires an order number. The options are: ${getCommandList(subcommands)}`,
    success: false,
  }
}
