// Module imports
const { delay } = require('lodash')
const firebaseAdmin = require('firebase-admin')
const fs = require('fs')
const path = require('path')
const TwitchJS = require('twitch-js')
const uuid = require('uuid/v4')






// Local imports
const config = require('./config')
const logger = require('./logger')





const options = {
  channels: config.connectionOptions.defaultChannels,
  identity: {
    username: config.apis.twitch.username,
    password: config.apis.twitch.accessToken,
  },
  options: {
    clientID: process.env.TWITCH_CLIENT_ID,
  },
}

const twitchClient = new TwitchJS.client(options)





async function handleCommand (commandFunction, messageData) {
  const { args, channel, command, userstate } = messageData
  const logGroupID = uuid()
  let delayTime = 0

  logger.info(`${userstate['display-name']} is attempting to execute \`${command}\` in \`${channel}\``, {
    args,
    channel,
    command,
    group: logGroupID,
    user: userstate.username,
  })

  const result = await commandFunction(messageData, firebaseAdmin)

  if ((typeof result.success === 'undefined') || result.success) {
    logger.info(`${userstate['display-name']}'s attempt to execute \`${command}\` in \`${channel}\` was succesful - executing command functions...`, {
      group: logGroupID,
      result,
      success: true,
    })
  } else {
    logger.info(`${userstate['display-name']}'s attempt to execute \`${command}\` in \`${channel}\` was unsuccesful`, {
      group: logGroupID,
      result,
      success: false,
    })
  }

    for (const [key, value] of Object.entries(result)) {
      let valueAsArray = value

      if (['action', 'say'].includes(key)) {
        if (!Array.isArray(value)) {
          valueAsArray = [value]
        }

        for (const item of valueAsArray) {
        setTimeout(() => {
          twitchClient[key](channel, item)
        }, delayTime)

          delayTime += 500
        }
      }
    }

  delay(() => logger.info(`Execution of command functions is complete`, { group: logGroupID }), delayTime)
  }





function initialize () {
  // Gather all the command files in the `/commands` directory
  const commandsDirectory = path.resolve('commands')
  const commands = fs.readdirSync(commandsDirectory).reduce((accumulator, filename) => {
    if (/\.js$/.test(filename)) {
      const command = filename.replace(/\.js$/, '')

      accumulator[command] = require(path.resolve(commandsDirectory, command))
      accumulator[command].default = true
    }

    return accumulator
  }, { channels: {} })

  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(config.apis.firebase.credentials),
    databaseURL: config.apis.firebase.url,
  })

  twitchClient.on('chat', (channel, userstate, message, self) => {
    if (self) {
      return
    }


    if (/^!\w+/.test(message)) {
      const safeChannelName = channel.replace(/^#/, '')
      const [, command, args] = /^!(\w+) ?(.*)/.exec(message)
      const commandFunction = commands[command] || commands.channels[safeChannelName][command]

      if (commandFunction) {
        handleCommand(commandFunction, {
          args,
          channel,
          command,
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

        channelCommands[command.name] = () => command
        channelCommands[command.name].remote = true

        logger.info(`Command \`${command.name}\` added`)
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
