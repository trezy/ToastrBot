class User {
  /***************************************************************************\
    Public methods
  \***************************************************************************/

  constructor (userData, server) {
    this.originalUser = userData
    this.server = server
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get atName () {
    return `<@!${this.id}>`
  }

  get displayName () {
    return this.username
  }

  get id () {
    return this.originalUser.id
  }

  get roles () {
    return this.originalUser.roles.map(id => this.server.roles[id])
  }

  get rolesList () {
    return Object.values(this.roles).map(({ name }) => name)
  }

  get username () {
    return this.originalUser.username
  }
}





export default User
