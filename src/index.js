// Module imports
import firebaseAdmin from 'firebase-admin'
import TwitchJS from 'twitch-js'






// Local imports
import Bot from './structures/Bot'
import config from './config'





const twitchClient = new TwitchJS.client({
  identity: {
    username: config.apis.twitch.username,
    password: config.apis.twitch.accessToken,
  },
  options: {
    clientID: process.env.TWITCH_CLIENT_ID,
  },
})

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(config.apis.firebase.credentials),
  databaseURL: config.apis.firebase.url,
})





new Bot({
  firebase: firebaseAdmin,
  twitch: twitchClient,
})
