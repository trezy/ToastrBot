// Module imports
import path from 'path'
import uuid from 'uuid/v4'





// Local imports
import logger from '../logger'





class Command {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  constructor (options, commandFunction) {
    this.options = options
    this.commandFunction = commandFunction
  }

  async execute (messageData) {
    const { args, channel, commandName, userstate } = messageData
    const logGroupID = uuid()
    let delayTime = 0

    logger.info(`${userstate['display-name']} is attempting to execute \`${commandName}\` in \`${channel.name}\``, {
      args,
      channel: channel.name,
      commandName,
      group: logGroupID,
      user: userstate.username,
    })

    const result = await this.commandFunction(messageData, this.firebase)

    if ((typeof result.success === 'undefined') || result.success) {
      logger.info(`${userstate['display-name']}'s attempt to execute \`${commandName}\` in \`${channel.name}\` was successful - executing command functions...`, {
        group: logGroupID,
        result,
        success: true,
      })
    } else {
      logger.info(`${userstate['display-name']}'s attempt to execute \`${commandName}\` in \`${channel.name}\` was unsuccessful`, {
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
            this.twitch[key](channel.name, item)
          }, delayTime)

          delayTime += 500
        }
      }
    }

    setTimeout(() => logger.info(`Command functions have been queued`, { group: logGroupID }), delayTime)
  }





  /***************************************************************************\
    Setters
  \***************************************************************************/

  get commandFunction () {
    return this._commandFunction
  }

  get defaultOptions () {
    return {
      name: null,
      state: 'default',
      firebase: null,
      twitch: null,
    }
  }

  get firebase () {
    return this.options.firebase
  }

  get isDefault () {
    return this.options.state === 'default'
  }

  get isRemote () {
    return this.options.state === 'remote'
  }

  get name () {
    return this.options.name
  }

  get options () {
    return this._options || this.defaultOptions
  }

  get state () {
    return this.options.state
  }

  get twitch () {
    return this.options.twitch
  }





  /***************************************************************************\
    Setters
  \***************************************************************************/

  set commandFunction (value) {
    if (value) {
      this._commandFunction = value
    } else {
      this._commandFunction = require(path.resolve(__dirname, '..', 'commands', this.name)).default
    }
  }

  set options (value) {
    this._options = {
      ...this.defaultOptions,
      ...value,
    }
  }
}





export default Command
