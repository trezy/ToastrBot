import '../mocks/requires/firebase-credentials.mock'
import User from '../../src/structures/User'
import userstate from '../mocks/userstate.mock'





const commandData = function (options) {
  return {
    args: null,
    bot: {},
    channel: {},
    commands: {
      '8ball': null,
      'command': null,
      'commands': null,
      'execute': null,
      'mods': null,
      'perms': null,
    },
    user: new User(userstate),
    ...options,
  }
}





export default commandData
