// Module imports
import firebaseAdmin from 'firebase-admin'
import fs from 'fs'
import path from'path'






// Local imports
import Channel from './Channel'
import Command from './Command'
import logger from '../logger'





class Bot {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _bindFirebaseEvents () {
    this.channelsRef.on('child_added', ({ key }) => this._handleNewChannel(key))
  }

  _handleNewChannel = async channelName => {
    logger.info(`New channel added: ${channelName}`)

    this.channels[channelName] = new Channel({
      bot: this,
      name: `#${channelName}`,
    })

    await this.channels[channelName].join()
  }





  /***************************************************************************\
    Public Properties
  \***************************************************************************/

  constructor (options) {
    const { twitch } = options

    this.options = options

    this._bindFirebaseEvents()

    twitch.connect()
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get channels () {
    return this._channels || (this._channels = {})
  }

  get channelsRef () {
    return this._channelsRef || (this._channelsRef = this.database.ref('channels'))
  }

  get database () {
    return this.firebase.database()
  }

  get commands () {
    if (!this._commands) {
      const commandsDirectory = path.resolve(__dirname, '..', 'commands')
      const commandsDirectoryContents = fs.readdirSync(commandsDirectory)

      const commandFiles = commandsDirectoryContents.filter(filename => /\.js$/.test(filename))

      this._commands = commandFiles.reduce((accumulator, filename) => {
        const commandName = filename.replace(/\.js$/, '')

        accumulator[commandName] = new Command({
          firebase: this.firebase,
          name: commandName,
          twitch: this.twitch,
        })

        return accumulator
      }, {})
    }

    return this._commands
  }

  get defaultOptions () {
    return {
      firebase: null,
      twitch: null,
    }
  }

  get firebase () {
    return this.options.firebase
  }

  get options () {
    return this._options || this.defaultOptions
  }

  get twitch () {
    return this.options.twitch
  }





  /***************************************************************************\
    Setters
  \***************************************************************************/

  set options (value) {
    this._options = {
      ...this.defaultOptions,
      ...value,
    }
  }
}





export default Bot
