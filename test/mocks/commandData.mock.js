import fs from 'fs'
import path from 'path'





import '../mocks/requires/firebase-credentials.mock'
import User from '../../src/structures/User'
import userstate from '../mocks/userstate.mock'





const commandData = function (options) {
  const localCommands = fs.readdirSync(path.resolve('src', 'commands')).reduce((accumulator, filename) => {
    if (/\.js$/.test(filename)) {
      accumulator[filename.replace(/\.js$/, '')] = () => {}
    }

    return accumulator
  }, {})

  return {
    args: null,
    bot: {},
    channel: {},
    commands: localCommands,
    user: new User(userstate),
    ...options,
  }
}





export default commandData
