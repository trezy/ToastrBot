// Module imports
import fs from 'fs'
import path from 'path'
import uuid from 'uuid/v4'





// Local imports
import fillTemplate from '../helpers/fillTemplate'
import getColorFromName from '../helpers/getColorFromName'
import logger from '../logger'
import parseDiscordVariables from '../helpers/parseDiscordVariables'





class Command {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _afterExecute = (messageData, result, logGroupID) => {
    const {
      action,
      args,
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

    if (handlerType === 'embed') {
      value = value.map(item => ({
        ...item,
        color: (typeof item.color === 'string') ? getColorFromName(item.color) : item.color,
        description: item.description ? this._renderSubstitution(item.description, messageData) : null,
      }))
    }

    if (['action', 'say'].includes(handlerType)) {
      value = value.map(item => this._renderSubstitution(item, messageData))
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

  _renderSubstitution = (string, messageData) => {
    const {
      args,
      server,
    } = messageData
    const splitArgs = args.split(' ')
    const onlyDecimalsRegex = /^\d+$/u
    const replaceableRegex = /\{\{([\S\s]+?)\}\}/gmu
    const startsWithDecimalRegex = /^(\d+)\./u
    const stringRegex = /^['"](.*)['"]$/u
    const matches = [...string.matchAll(replaceableRegex)]

    let alteredString = string

    matches.forEach(([original, capture]) => {
      const discordVariables = parseDiscordVariables(args, server)
      const replaceables = capture.split('|').map(item => {
        const trimmedItem = item.trim()

        if (onlyDecimalsRegex.test(trimmedItem)) {
          return parseInt(trimmedItem)
        }

        return trimmedItem
      })

      while (replaceables.length > 0) {
        const replaceable = replaceables[0]

        if ((typeof replaceable === 'number') && splitArgs[replaceable]) {
          alteredString = alteredString.replace(original, splitArgs[replaceable])
          break
        }

        if (typeof replaceable === 'string') {
          if (stringRegex.test(replaceable)) {
            alteredString = alteredString.replace(original, replaceable.replace(stringRegex, '$1'))
            break
          }

          if (startsWithDecimalRegex.test(replaceable)) {
            const splitReplaceable = replaceable.split('.')

            const arg = splitArgs[splitReplaceable.shift()]
            let replacement = discordVariables[arg]

            splitReplaceable.forEach(key => {
              replacement = replacement[key]
            })

            alteredString = alteredString.replace(original, replacement)
            break
          }
        }

        replaceables.shift()
      }
    })

    return alteredString
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

  getDescription = options => fillTemplate(this.descriptionTemplate, options)

  getDocs = options => fillTemplate(this.docsTemplate, options)

  getHint = options => fillTemplate(this.hintTemplate || '', options)





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

  get descriptionTemplate () {
    return this.docsFrontMatter?.description || '*No description.*'
  }

  get discord () {
    return this.options.discord
  }

  get docsTemplate () {
    return this.docsFile.replace(/^\s*---([\S\s]*?)---/m, '').trim()
  }

  get docsFile () {
    try {
      return fs.readFileSync(this.docsPath, 'utf8')
    } catch (error) {
      return '*No docs.*'
    }
  }

  get docsFrontMatter () {
    const frontMatterObject = {}
    const frontMatterString = /^\s*---([\S\s]*?)---/m.exec(this.docsFile)

    if (frontMatterString) {
      frontMatterString[1].trim().split('\n').forEach(line => {
        const [key, value] = line.replace(/:\s*:\s*/, ':').split(':')
        frontMatterObject[key] = value
      })
    }

    return frontMatterObject
  }

  get docsPath () {
    return path.resolve(__dirname, '..', 'commandDocs', `${this.name}.md`)
  }

  get firebase () {
    return this.options.firebase
  }

  get hintTemplate () {
    return this.docsFrontMatter?.hint
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
