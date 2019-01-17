import config from '../config'





class User {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  constructor (userstate) {
    this.userstate = userstate
  }

  update (userstate) {
    this.userstate = userstate
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get atName () {
    return `@${this.userstate['display-name']}`
  }

  get badges () {
    return this.userstate.badges || {}
  }

  get id () {
    return this.badges.id
  }

  get isBroadcaster () {
    return this.badges.broadcaster
  }

  get isModerator () {
    return this.badges.moderator
  }

  get isSubscriber () {
    return this.userstate.subscriber
  }

  get name () {
    return this.userstate.username
  }

  get roles () {
    let highestRole = null

    if (this.isBroadcaster) {
      highestRole = 'broadcaster'
    } else if (this.isModerator) {
      highestRole = 'moderator'
    } else if (this.isSubscriber) {
      highestRole = 'subscriber'
    }

    const highestRoleIndex = config.roles.indexOf(highestRole)

    return (highestRoleIndex !== -1) ? config.roles.slice(highestRoleIndex) : []
  }
}





export default User
