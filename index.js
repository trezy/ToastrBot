// Module imports
const { delay } = require('lodash')
const firebaseAdmin = require('firebase-admin')
const fs = require('fs')
const path = require('path')
const TwitchJS = require('twitch-js')
const uuid = require('uuid/v4')






// Local imports
const Command = require('./structures/Command')
const config = require('./config')
const logger = require('./logger')





const twitchClient = new TwitchJS.client({
  channels: config.connectionOptions.defaultChannels,
  identity: {
    username: config.apis.twitch.username,
    password: config.apis.twitch.accessToken,
  },
  options: {
    clientID: process.env.TWITCH_CLIENT_ID,
  },
})





function initialize () {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(config.apis.firebase.credentials),
    databaseURL: config.apis.firebase.url,
    })

  // Gather all the command files in the `/commands` directory
  const commandsDirectory = path.resolve('commands')
  const commands = fs.readdirSync(commandsDirectory).reduce((accumulator, filename) => {
    if (/\.js$/.test(filename)) {
      const command = filename.replace(/\.js$/, '')

      accumulator[command] = new Command({
        firebase: firebaseAdmin,
        name: command,
        twitchClient,
      })
    }

    return accumulator
  }, { channels: {} })

  twitchClient.on('chat', (channel, userstate, message, self) => {
    if (self) {
      return
    }

    if (/^!\w+/.test(message)) {
      const safeChannelName = channel.replace(/^#/, '')
      const [, commandName, args] = /^!(\w+) ?(.*)/.exec(message)
      const command = commands[commandName] || commands.channels[safeChannelName][commandName]

      if (command) {
        command.execute({
          args,
          channel,
          commandName,
          commands,
          message,
          self,
          userstate,
        })
      }
    }
  })

  twitchClient.on('join', (channel, username, self) => {
    if (self) {
      const safeChannelName = channel.replace(/^#/, '')
      const commandsDatabaseRef = firebaseAdmin.database().ref(`${safeChannelName}/commands`)
      let channelCommands = commands.channels[safeChannelName]

      if (!channelCommands) {
        channelCommands = commands.channels[safeChannelName] = {}
      }

      commandsDatabaseRef.on('child_added', snapshot => {
        const command = snapshot.val()

        channelCommands[command.name] = new Command({
          firebase: firebaseAdmin,
          name: command.name,
          state: 'remote',
          twitchClient,
        }, () => command)

        logger.info(`Command \`${command.name}\` added`)
      })

      commandsDatabaseRef.on('child_changed', snapshot => {
        const command = snapshot.val()

        channelCommands[command.name] = new Command({
          firebase: firebaseAdmin,
          name: command.name,
          state: 'remote',
          twitchClient,
        }, () => command)

        logger.info(`Command \`${command.name}\` modified`)
      })

      commandsDatabaseRef.on('child_removed', snapshot => {
        const command = snapshot.val()

        delete channelCommands[command.name]

        logger.info(`Command \`${command.name}\` removed`)
      })
    }
  })

  // Finally, connect to the channel
  twitchClient.connect()
}





initialize()
