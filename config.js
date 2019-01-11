require('dotenv').config()





module.exports = {
  apis: {
    firebase: {
      credentials: require('./firebase-credentials.json'),
      url: process.env.TOASTR_FIREBASE_DB_URL,
    },
    twitch: {
      accessToken: process.env.TOASTR_TWITCH_OAUTH_TOKEN,
      username: process.env.TOASTR_TWITCH_USERNAME,
    },
  },

  connectionOptions: {
    defaultChannels: ['#trezycodes'],
  },
}
