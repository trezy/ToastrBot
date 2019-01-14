// Local imports
import Command from './Command'
import logger from '../logger'





class Channel {
  /***************************************************************************\
    Local Properties
  \***************************************************************************/

  commands = {}





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _bindFirebaseEvents () {
    this.commandsRef.on('child_added', this._handleNewCommand)

    this.commandsRef.on('child_changed', this._handleChangedCommand)

    this.commandsRef.on('child_removed', this._handleDeletedCommand)
  }

  _bindTwitchEvents () {
    this.twitch.on('join', this._handleChannelJoin)
  }

  _handleChangedCommand = snapshot => {
    const command = snapshot.val()

    this.commands[snapshot.key] = new Command({
      firebase: this.firebase,
      name: snapshot.key,
      state: 'remote',
      twitch: this.twitch,
    }, () => command)

    logger.info(`Command \`${snapshot.key}\` modified`)
  }

  _handleChannelJoin = (channel, username, self) => {
    if (self && (channel.replace(/^#/, '') === this.name)) {
      // this.twitch.off('join', this._handleChannelJoin)
      this.state = 'connected'
    }
  }

  _handleDeletedCommand = snapshot => {
    delete this.commands[snapshot.key]

    logger.info(`Command \`${snapshot.key}\` removed`)
  }

  _handleNewCommand = snapshot => {
    const command = snapshot.val()

    this.commands[snapshot.key] = new Command({
      firebase: this.firebase,
      name: snapshot.key,
      state: 'remote',
      twitch: this.twitch,
    }, () => command)

    logger.info(`Command \`${snapshot.key}\` added for channel ${this.name}`)
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  constructor (options) {
    this.options = options

    this._bindFirebaseEvents()

    this._bindTwitchEvents()
  }

  handleMessage = () => {}

  join = async () => {
    await this.twitch.join(`#${this.name}`)
  }





  /***************************************************************************\
    Setters
  \***************************************************************************/

  get bot () {
    return this.options.bot
  }

  get commandsRef () {
    return this._commandsRef || (this._commandsRef = this.databaseRef.child('commands'))
  }

  get database () {
    return this._database || (this._database = this.firebase.database())
  }

  get databaseRef () {
    return this._databaseRef || (this._databaseRef = this.database.ref(this.name))
  }

  get defaultOptions () {
    return {
      name: null,
      firebase: null,
      twitchClient: null,
    }
  }

  get state () {
    return this._state || (this._state = 'disconnected')
  }

  get firebase () {
    return this.options.firebase
  }

  get name () {
    return this.options.name
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

  set state (value) {
    const possibleStates = [
      'connected',
      'disconnected',
    ]

    if (!possibleStates.includes(value)) {
      throw new Error(`Channel received invalid state. State must be one of: ${possibleStates.join(', ')}`)
    }

    this._state = value
  }
}





module.exports = Channel
