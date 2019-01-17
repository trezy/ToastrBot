// Local imports
import Command from './Command'
import logger from '../logger'
import User from './User'





class Channel {
  /***************************************************************************\
    Local Properties
  \***************************************************************************/

  permissions = {}





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _bindFirebaseEvents () {
    this.commandsRef.on('child_added', this._handleNewCommand)

    this.commandsRef.on('child_added', this._handleNewCommand)
    this.commandsRef.on('child_changed', this._handleChangedCommand)
    this.commandsRef.on('child_removed', this._handleDeletedCommand)

    this.permissionsRef.on('child_added', this._handleNewPermission)
    this.permissionsRef.on('child_changed', this._handleChangedPermission)
    this.permissionsRef.on('child_removed', this._handleDeletedPermission)
  }

  _bindTwitchEvents () {
    this.twitch.on('chat', this._handleMessage)
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

  _handleChangedPermission = snapshot => {
    this.permissions[snapshot.key] = snapshot.val()

    logger.info(`Permissions for \`${snapshot.key}\` command have been modified`)
  }

  _handleChannelJoin = (channelName, username, self) => {
    if (self && (channelName === this.name)) {
      // this.twitch.off('join', this._handleChannelJoin)
      this.state = 'connected'
    }
  }

  _handleDeletedCommand = snapshot => {
    delete this.commands[snapshot.key]

    logger.info(`Command \`${snapshot.key}\` removed`)
  }

  _handleDeletedPermission = snapshot => {
    delete this.permissions[snapshot.key]

    logger.info(`Permissions for command \`${snapshot.key}\` have been removed`)
  }

  _handleMessage = (channelName, userstate, message, self) => {
    if (self || channelName !== this.name) {
      return
    }

    let user = this.users[userstate.username]

    if (user) {
      user.update(userstate)
    } else {
      user = new User(userstate)
      this.users[userstate.username] = user
    }

    if (this.commandRegex.test(message)) {
      const [, commandName, args] = this.commandRegex.exec(message)
      const command = this.commands[commandName]

      if (command) {
        if (this._userIsPermittedToRunCommand(user, command)) {
        command.execute({
          args,
          bot: this.bot,
          channel: this,
          commandName,
          commands: this.commands,
          message,
          self,
            user,
        })
        } else {
          this.twitch.say(this.name, `Sorry, ${user.atName}, you're not permitted to use the \`${command.name}\` command`)
        }
      }
    }
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

  _handleNewPermission = snapshot => {
    this.permissions[snapshot.key] = snapshot.val()

    logger.info(`Permissions have been set for \`${snapshot.key}\` command`)
  }


  _userIsPermittedToRunCommand (user, command) {
    const commandPermissions = this.permissions[command.name]

    if (!commandPermissions || commandPermissions.includes(user.name)) {
      return true
    }

    let result = false

    for (const role of commandPermissions) {
      if (user.roles.includes(role)) {
        result = true
        break
      }
    }

    return result
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  constructor (options) {
    this.options = options

    this._bindFirebaseEvents()

    this._bindTwitchEvents()
  }

  getModerators = async () => {
    return await this.twitch.mods(this.name)
  }

  join = async () => {
    await this.twitch.join(this.name)
  }





  /***************************************************************************\
    Setters
  \***************************************************************************/

  get bot () {
    return this.options.bot
  }

  get commands () {
    if (!this._commands) {
      this._commands = {}
    }

    return new Proxy({
      ...this.bot.commands,
      ...this._commands,
    }, {
      set: (obj, prop, value) => {
        return Reflect.set(this._commands, prop, value)
      }
    })
  }

  get commandsRef () {
    return this._commandsRef || (this._commandsRef = this.databaseRef.child('commands'))
  }

  get commandRegex () {
    return /^!([\w\d_-]+)\s?(.*)/
  }

  get database () {
    return this._database || (this._database = this.firebase.database())
  }

  get databaseRef () {
    return this._databaseRef || (this._databaseRef = this.database.ref(this.safeName))
  }

  get defaultOptions () {
    return { name: null }
  }

  get firebase () {
    return this.bot.firebase
  }

  get name () {
    return this.options.name
  }

  get options () {
    return this._options || this.defaultOptions
  }

  get permissionsRef () {
    return this._permissionsRef || (this._permissionsRef = this.databaseRef.child('permissions'))
  }

  get safeName () {
    return this.name.replace(/^#/, '')
  }

  get state () {
    return this._state || (this._state = 'disconnected')
  }

  get twitch () {
    return this.bot.twitch
  }

  get users () {
    return this._users || (this._users = {})
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





export default Channel
