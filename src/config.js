// Module imports
import dotenv from 'dotenv'





import firebaseCredentials from '../firebase-credentials.json'





dotenv.config()





module.exports = {
  apis: {
    firebase: {
      credentials: firebaseCredentials,
      url: process.env.TOASTR_FIREBASE_DB_URL,
    },
    twitch: {
      accessToken: process.env.TOASTR_TWITCH_OAUTH_TOKEN,
      clientID: process.env.TWITCH_CLIENT_ID,
      username: process.env.TOASTR_TWITCH_USERNAME,
    },
  },

  connectionOptions: {},

  roles: [
    'broadcaster',
    'editor',
    'moderator',
    'vip',
    'subscriber',
    'follower',
    'regular',
  ],
}
