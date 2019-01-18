// Local imports
import Channel from './Channel'
import getLocalCommands from '../helpers/getLocalCommands'
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
    return this._commands || (this._commands = getLocalCommands({
      firebase: this.firebase,
      twitch: this.twitch,
    }))
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
