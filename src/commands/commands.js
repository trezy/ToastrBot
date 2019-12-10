// Module imports
import emoji from 'node-emoji'





// Local imports
import getCommandList from '../helpers/getCommandList'





export default ({ commands }) => ({
  say: emoji.emojify(`This is a list of all available commands: ${getCommandList(commands)}.`),
  success: true,
})
