import { merge } from 'lodash'
import fs from 'fs'
import path from 'path'





import '../mocks/requires/firebase-credentials.mock'
import Channel from '../../src/structures/Channel'
import firebaseMock from '../mocks/firebase.mock'
import User from '../../src/structures/User'
import userstate from '../mocks/userstate.mock'
import twitchMock from '../mocks/twitch.mock'





const commandData = function (options) {
  const localCommands = fs.readdirSync(path.resolve('src', 'commands')).reduce((accumulator, filename) => {
    if (/\.js$/.test(filename)) {
      accumulator[filename.replace(/\.js$/, '')] = () => {}
    }

    return accumulator
  }, {})

  const bot = {
    firebase: firebaseMock(),
    twitch: twitchMock(),
  }

  return merge({
    args: null,
    bot,
    channel: new Channel({
      bot,
      name: `#channel`,
    }),
    commands: localCommands,
    user: new User(userstate),
  }, options)
}





export default commandData
