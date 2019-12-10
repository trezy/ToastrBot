// Module imports
import dotenv from 'dotenv'





dotenv.config()





module.exports = {
  apis: {
    discord: {
      clientID: process.env.TOASTR_DISCORD_CLIENT_ID,
      clientSecret: process.env.TOASTR_DISCORD_CLIENT_SECRET,
      accessToken: process.env.TOASTR_DISCORD_ACCESS_TOKEN,
    },
    firebase: {
      credentials: {
        auth_provider_x509_cert_url: process.env.TOASTR_FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        auth_uri: process.env.TOASTR_FIREBASE_AUTH_URI,
        client_email: process.env.TOASTR_FIREBASE_CLIENT_EMAIL,
        client_id: process.env.TOASTR_FIREBASE_CLIENT_ID,
        client_x509_cert_url: process.env.TOASTR_FIREBASE_CLIENT_X509_CERT_URL,
        project_id: process.env.TOASTR_FIREBASE_PROJECT_ID,
        private_key: process.env.TOASTR_FIREBASE_PRIVATE_KEY,
        private_key_id: process.env.TOASTR_FIREBASE_PRIVATE_KEY_ID,
        token_uri: process.env.TOASTR_FIREBASE_TOKEN_URI,
        type: process.env.TOASTR_FIREBASE_TYPE,
      },
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
