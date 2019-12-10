// Local imports
import Channel from './Channel'
import DiscordServer from './discord/Server'
import getLocalCommands from '../helpers/getLocalCommands'
import logger from '../logger'





class Bot {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _bindDiscordEvents = () => {
    this.discord.on('ready', () => {
      logger.info('Discord bot is ready!')
    })

    this.discord.on('guildCreate', async server => {
      logger.info(`New Discord server added: ${server.name}`)

      this.discordServers[server.id] = new DiscordServer(server, this)
    })

    this.discord.on('disconnect', (errMsg, code) => {
      logger.info(`Disconnected from Discord. Error Code ${code}. ${errMsg ? `Message ${errMsg}.` : 'No message.'}`)
      this.discord.connect()
    })
  }

  _bindFirebaseEvents = () => {
    this.twitchRef.on('child_added', ({ key }) => this._handleNewTwitchChannel(key))
  }

  _handleNewTwitchChannel = async channelName => {
    logger.info(`New channel added: ${channelName}`)

    this.twitchChannels[channelName] = new Channel({
      bot: this,
      name: `#${channelName}`,
    })

    await this.twitchChannels[channelName].join()
  }





  /***************************************************************************\
    Public Properties
  \***************************************************************************/

  constructor (options) {
    this.options = options
    this.initialize()
  }

  initialize = async () => {
    this._bindDiscordEvents()
    this._bindFirebaseEvents()

    this.discord.connect()
    this.twitch.connect()
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get commands () {
    return this._commands || (this._commands = getLocalCommands({
      firebase: this.firebase,
      twitch: this.twitch,
    }))
  }

  get database () {
    return this.firebase.database()
  }

  get defaultOptions () {
    return {
      firebase: null,
      twitch: null,
    }
  }

  get discord () {
    return this.options.discord
  }

  get discordServers () {
    return this._discordServers || (this._discordServers = {})
  }

  get discordServersRef () {
    return this._discordServersRef || (this._discordServersRef = this.database.ref('discord/servers'))
  }

  get firebase () {
    return this.options.firebase
  }

  get firestore () {
    return this.firebase.firestore()
  }

  get options () {
    return this._options || this.defaultOptions
  }

  get twitch () {
    return this.options.twitch
  }

  get twitchChannels () {
    return this._twitchChannels || (this._twitchChannels = {})
  }

  get twitchRef () {
    return this._twitchRef || (this._twitchRef = this.database.ref('twitch'))
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
