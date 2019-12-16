// Module imports
import emoji from 'node-emoji'





// Local imports
import Command from '../Command'
import DiscordUser from './User'
import logger from '../../logger'





// Local constants
const enums = {
  SUCCESS: 'success',
  FAILURE: 'failure',
}





class Server {
  /***************************************************************************\
    Local Properties
  \***************************************************************************/

  prefixes = []

  type = 'discord'





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _addChannel = async channel => {
    if (channel.type === 0) {
      await this.channelsCollection.doc(channel.id).set({
        id: channel.id,
        name: channel.name,
        topic: channel.topic,
      })

      this.channels[channel.id] = channel
    }
  }

  _addRole = async role => {
    this.roles[role.id] = role

    await this.rolesCollection.doc(role.id).set({
      id: role.id,
      name: role.name,
      permissions: role._permissions,
    })
  }

  _addUser = async user => {
    if (!user.bot) {
      const userDocRef = this.usersCollection.doc(user.id)

      this.users[user.id] = new DiscordUser(user, this)

      await userDocRef.set({
        id: user.id,
        nickname: user.nick || null,
        roles: user.roles,
        username: `${user.username}#${user.discriminator}`,
      })
    }
  }

  _deleteChannel = async channel => {
    await this.channelsCollection.doc(channel.id).delete()

    delete this.channels[channel.id]
  }

  _bindDiscordEvents = () => {
    this.discord.on('channelCreate', this._handleChannelCreate)
    this.discord.on('channelDelete', this._handleChannelDelete)
    this.discord.on('channelUpdate', this._handleChannelUpdate)
    this.discord.on('messageCreate', this._handleMessage)
  }

  _bindFirebaseEvents = () => {
    this.commandsCollection.onSnapshot(this._handleCommandsUpdate)
    this.permissionsCollection.onSnapshot(this._handlePermissionsUpdate)
    this.prefixesCollection.onSnapshot(this._handlePrefixUpdate)
  }

  _handleChannelCreate = async channel => {
    if (channel.guild_id === this.server.id) {
      this._addChannel(channel)
    }
  }

  _handleChannelDelete = async channel => {
    if (channel.guild_id === this.server.id) {
      this._deleteChannel(channel)
    }
  }

  _handleChannelUpdate = async (oldChannel, channel) => {
    if (channel.guild_id === this.server.id) {
      this._updateChannel(oldChannel, channel)
    }
  }

  _handleCommandsUpdate = snapshot => {
    snapshot.docChanges().forEach(({ doc, type }) => {
      const command = doc.data()

      switch (type) {
        case 'added':
        case 'modified':
          this.commands[command.name] = new Command({
            discord: this.discord,
            firebase: this.firebase,
            id: doc.id,
            name: command.name,
            state: 'remote',
          }, () => command)
          break
        case 'removed':
          delete this.commands[command.name]
          break
      }
    })
  }

  _handleMessage = (username, userID, channelID, message) => {
    const channel = this.channels[channelID]
    const escapedMessage = emoji.unemojify(message)
    const isFromThisServer = Boolean(channel)
    const isFromBot = userID === this.discord.id

    const log = {
      author: userID,
      body: message,
      channel: channelID,
      status: enums.FAILURE,
    }

    if (isFromThisServer && !isFromBot) {
      const isFormattedAsCommand = this.commandRegex.test(escapedMessage)

      if (isFormattedAsCommand) {
        const [, commandName, args] = this.commandRegex.exec(escapedMessage)
        const command = this.commands[commandName]
        const user = this.users[userID]

        log.isCommand = true
        log.command = commandName
        log.commandArgs = args

        if (command) {
          if (this._userIsPermittedToRunCommand(user, command)) {
            log.status = enums.SUCCESS

            command.execute({
              args,
              bot: this.bot,
              channel,
              command,
              commandName,
              commands: this.commands,
              defaultPrefix: this.prefixes[0],
              message,
              user,
              server: this,

              action: response => {
                this.discord.sendMessage({
                  to: channel.id,
                  message: `_${emoji.emojify(response)}_`,
                })
              },

              embed: response => {
                this.discord.sendMessage({
                  to: channel.id,
                  embed: response,
                })
              },

              say: response => {
                this.discord.sendMessage({
                  message: emoji.emojify(response),
                  to: channel.id,
                })
              },
            })
          } else {
            this.discord.sendMessage({
              message: `Sorry, ${user.atName}, you're not permitted to use the \`${command.name}\` command`,
              to: channel.id,
            })
          }
        }
      }

      this.log(log)
    }
  }

  _handlePermissionsUpdate = snapshot => {
    snapshot.docChanges().forEach(({ doc, type }) => {
      const commandName = doc.id
      const { permissions } = doc.data()

      switch (type) {
        case 'added':
        case 'modified':
          this.permissions[commandName] = permissions
          break
        case 'removed':
          delete this.permissions[commandName]
          break
      }
    })
  }

  _handlePrefixUpdate = snapshot => {
    snapshot.docChanges().forEach(({ doc, type })=> {
      const { prefix } = doc.data()
      const index = this.prefixes.indexOf(prefix)

      switch (type) {
        case 'added':
          this.prefixes.push(prefix)
          break
        case 'modified':
          this.prefixes[index] = prefix
          break
        case 'removed':
          this.prefixes.splice(index, 1)
          break
      }

      this.prefixes.sort((a, b) => {
        return a.default ? -1 : 1
      })
    })
  }

  _updateChannel = async (oldChannel, channel) => {
    const updateKeys = ['name', 'topic']
    const updates = {}
    let shouldUpdate = false

    updateKeys.forEach(key => {
      if (channel[key] !== oldChannel[key]) {
        updates[key] = channel[key]
        shouldUpdate = true
      }
    })

    if (shouldUpdate) {
      await this.channelsCollection.doc(channel.id).update(updates)
      this.channels[channel.id] = channel
    }
  }

  _userIsPermittedToRunCommand = (user, command) => {
    const commandPermissions = this.permissions[command.name]

    if (!commandPermissions || commandPermissions.includes(user.id)) {
      return true
    }

    let result = false

    for (const role of commandPermissions) {
      if (user.rolesList.includes(role)) {
        result = true
        break
      }
    }

    return result
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  constructor (server, bot) {
    this.bot = bot
    this.server = server

    this.initialize()
  }

  getModerators = () => Object.values(this.users).filter(({ roles }) => roles.includes(this.moderatorRole))

  initialize = async () => {
    const firebaseNow = this.firebase.firestore.FieldValue.serverTimestamp()
    const serverDoc = await this.serverDocRef.get()

    if (serverDoc.exists) {
      if (serverDoc.data().name !== this.server.name) {
        await this.serverDocRef.update({
          name: this.server.name,
          updatedAt: firebaseNow,
        })
      }
    } else {
      await this.serverDocRef.set({
        createdAt: firebaseNow,
        name: this.server.name,
        type: 'discord',
        updatedAt: firebaseNow,
      })

      await Promise.all([
        this.prefixesCollection.add({
          default: true,
          prefix: '!',
        }),
        this.prefixesCollection.add({
          default: false,
          prefix: '@ToastrBot ',
        }),
      ])
    }

    const promises = []

    Object.values(this.server.roles).forEach(item => promises.push(this._addRole(item)))
    Object.values(this.server.members).forEach(item => promises.push(this._addUser(item)))
    Object.values(this.server.channels).forEach(item => promises.push(this._addChannel(item)))

    await Promise.all(promises)

    this._bindDiscordEvents()
    this._bindFirebaseEvents()
  }

  log = log => {
    this.logsCollection.add({
      createdAt: this.firebase.firestore.FieldValue.serverTimestamp(),
      isCommand: false,
      status: enums.SUCCESS,
      ...log,
    })
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get channels () {
    return this._channels || (this._channels = {})
  }

  get channelsCollection () {
    return this.serverDocRef.collection('channels')
  }

  get commandRegex () {
    return new RegExp(`^(?:${this.prefixes.join('|')})([\\S]+)\\s?(.*)`, 'i')
  }

  get commands () {
    if (!this._commands) {
      this._commands = {}
    }

    return new Proxy({
      ...this.bot.commands,
      ...this._commands,
    }, {
      deleteProperty: (obj, key) => {
        return Reflect.deleteProperty(this._commands, key)
      },
      set: (obj, prop, value) => {
        return Reflect.set(this._commands, prop, value)
      }
    })
  }

  get commandsCollection () {
    return this.serverDocRef.collection('commands')
  }

  get discord () {
    return this.bot.discord
  }

  get firebase () {
    return this.bot.firebase
  }

  get firestore () {
    return this._firestore || (this._firestore = this.firebase.firestore())
  }

  get id () {
    return this.server.id
  }

  get logsCollection () {
    return this.serverDocRef.collection('logs')
  }

  get moderatorRole () {
    return Object.values(this.roles).find(({ name }) => name === 'Moderators')
  }

  get name () {
    return this.server.name
  }

  get permissions () {
    return this._permissions || (this._permissions = {})
  }

  get permissionsCollection () {
    return this.serverDocRef.collection('permissions')
  }

  get prefixesCollection () {
    return this.serverDocRef.collection('prefixes')
  }

  get roles () {
    return this._roles || (this._roles = {})
  }

  get rolesList () {
    return Object.values(this.roles).map(({ name }) => name)
  }

  get rolesCollection () {
    return this.serverDocRef.collection('roles')
  }

  get serverDocRef () {
    return this.serversCollection.doc(this.server.id)
  }

  get serversCollection () {
    return this.firestore.collection('servers')
  }

  get users () {
    return this._users || (this._users = {})
  }

  get usersCollection () {
    return this.serverDocRef.collection('users')
  }
}





export default Server
