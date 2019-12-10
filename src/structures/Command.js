// Module imports
import path from 'path'
import uuid from 'uuid/v4'





// Local imports
import getColorFromName from '../helpers/getColorFromName'
import logger from '../logger'





class Command {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _afterExecute = (messageData, result, logGroupID) => {
    const {
      action,
      commandName,
      embed,
      say,
      server,
      user,
    } = messageData
    let delayTime = 0
    let handlerType = null

    if ((typeof result.success === 'undefined') || result.success) {
      logger.info(`${user.atName}'s attempt to execute \`${commandName}\` in \`${server.name}\` was successful - executing command functions...`, {
        group: logGroupID,
        result,
        success: true,
      })
    } else {
      logger.info(`${user.atName}'s attempt to execute \`${commandName}\` in \`${server.name}\` was unsuccessful`, {
        group: logGroupID,
        result,
        success: false,
      })
    }

    if (result.embed) {
      if (embed) {
        handlerType = 'embed'

        if (typeof result.embed.color === 'string') {
          result.embed.color = getColorFromName(result.embed.color)
        }
      } else {
        handlerType = 'say'
      }
    } else if (result.action) {
      handlerType = 'action'
    } else if (result.say) {
      handlerType = 'say'
    }

    let value = result[handlerType]

    if (!Array.isArray(value)) {
      value = [value]
    }

    value.forEach(item => {
      setTimeout(() => {
        messageData[handlerType](item)
      }, delayTime)

      delayTime += 500
    })

    setTimeout(() => logger.info(`Command functions have been queued`, { group: logGroupID }), delayTime)
  }

  _beforeExecute = (messageData, logGroupID) => {
    const {
      args,
      commandName,
      server,
      user,
    } = messageData

    logger.info(`${user.atName} is attempting to execute \`${commandName}\` in \`${server.name}\``, {
      args,
      commandName,
      group: logGroupID,
      server: server.name,
      serverID: server.id,
      serverType: server.type,
      user: user.name,
    })
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  constructor (options, commandFunction) {
    this.options = options
    this.commandFunction = commandFunction
  }

  async execute (messageData) {
    const {
      args,
      channel,
      commandName,
      server,
      user,
    } = messageData
    const logGroupID = uuid()
    let delayTime = 0

    this._beforeExecute(messageData, logGroupID)

    const result = await this.commandFunction(messageData, this.firebase)

    this._afterExecute(messageData, result, logGroupID)
  }





  /***************************************************************************\
    Setters
  \***************************************************************************/

  get commandFunction () {
    return this._commandFunction
  }

  get defaultOptions () {
    return {
      firebase: null,
      discord: null,
      name: null,
      state: 'default',
      twitch: null,
    }
  }

  get discord () {
    return this.options.discord
  }

  get firebase () {
    return this.options.firebase
  }

  get id () {
    return this.options.id
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

  get permissions () {
    return this.options.permissions
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
