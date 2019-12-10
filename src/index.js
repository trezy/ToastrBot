// Module imports
import 'isomorphic-fetch'
import Discord from 'discord.io'
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
    clientID: config.apis.twitch.clientID,
  },
})

const discordClient = new Discord.Client({ token: config.apis.discord.accessToken })

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(config.apis.firebase.credentials),
  databaseURL: config.apis.firebase.url,
})





new Bot({
  discord: discordClient,
  firebase: firebaseAdmin,
  twitch: twitchClient,
})
