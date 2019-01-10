// Module imports
const { delay } = require('lodash')
const fs = require('fs')
const path = require('path')
const TwitchJS = require('twitch-js')
const uuid = require('uuid/v4')





// Local imports
const logger = require('./logger')





const options = {
  channels: ['#trezycodes'],
  identity: {
    username: 'trezycodes',
    password: `oauth:${process.env.TWITCH_ACCESS_TOKEN}`,
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
    user: userstate['display-name'],
  })

  const result = await commandFunction(messageData)

  if ((typeof result.success === 'undefined') || result.success) {
    logger.info(`${userstate['display-name']}'s attempt to execute \`${command}\` in \`${channel}\` was succesful - executing command functions...`, {
      group: logGroupID,
      result,
      success: true,
    })

    for (const [key, value] of Object.entries(result)) {
      let valueAsArray = value

      if (['action', 'say'].includes(key)) {
        if (!Array.isArray(value)) {
          valueAsArray = [value]
        }

        for (const item of valueAsArray) {
          delay(() => twitchClient[key](channel, item), delayTime)
          delayTime += 500
        }
      }
    }
  } else {
    logger.info(`${userstate['display-name']}'s attempt to execute \`${command}\` in \`${channel}\` was unsuccesful`, {
      group: logGroupID,
      result,
      success: false,
    })
  }
}





function initialize () {
  // Gather all the command files in the `/commands` directory
  const commandsDirectory = path.resolve('commands')
  const commands = fs.readdirSync(commandsDirectory).reduce((accumulator, filename) => {
    if (/\.js$/.test(filename)) {
      const command = filename.replace(/\.js$/, '')

      accumulator[command] = require(path.resolve(commandsDirectory, command))
    }

    return accumulator
  }, {})

  twitchClient.on('chat', (channel, userstate, message, self) => {
    if (self) {
      return
    }

    if (/^!/.test(message)) {
      const [, command, args] = /^!(\w+) ?(.*)/.exec(message)

      if (commands[command]) {
        handleCommand(commands[command], {
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

  // Finally, connect to the channel
  twitchClient.connect()
}





initialize()
