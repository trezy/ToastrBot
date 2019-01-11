// Module imports
const path = require('path')
const uuid = require('uuid/v4')





// Local imports
const logger = require('../logger')
const appDirectory = path.dirname(require.main.filename)





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

    logger.info(`${userstate['display-name']} is attempting to execute \`${commandName}\` in \`${channel}\``, {
      args,
      channel,
      commandName,
      group: logGroupID,
      user: userstate.username,
    })

    const result = await this.commandFunction(messageData, this.firebase)

    console.log('')
    console.log('RESULT:', result)
    console.log('')

    if ((typeof result.success === 'undefined') || result.success) {
      logger.info(`${userstate['display-name']}'s attempt to execute \`${commandName}\` in \`${channel}\` was succesful - executing command functions...`, {
        group: logGroupID,
        result,
        success: true,
      })
    } else {
      logger.info(`${userstate['display-name']}'s attempt to execute \`${commandName}\` in \`${channel}\` was unsuccesful`, {
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
            this.twitchClient[key](channel, item)
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
      twitchClient: null,
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

  get twitchClient () {
    return this.options.twitchClient
  }





  /***************************************************************************\
    Setters
  \***************************************************************************/

  set commandFunction (value) {
    if (value) {
      this._commandFunction = value
    } else {
      this._commandFunction = require(path.resolve(appDirectory, 'commands', this.name))
    }
  }

  set options (value) {
    this._options = {
      ...this.defaultOptions,
      ...value,
    }
  }
}





module.exports = Command
