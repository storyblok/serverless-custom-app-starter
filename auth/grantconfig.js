const SHA256 = require('crypto-js/sha256')
const { v4: uuid } = require('uuid')
const codeIdentifier = uuid()

module.exports = {
  config: {
    defaults: {
      origin: 'http://localhost:3000',
      transport: 'session',
    },
    storyblok: {
      key: process.env.CONFIDENTIAL_CLIENT_ID,
      secret: process.env.CONFIDENTIAL_CLIENT_SECRET,
      redirect_uri: process.env.CONFIDENTIAL_CLIENT_REDIRECT_URI,
      authorize_url: 'https://app.storyblok.com/oauth/authorize',
      access_url: 'https://app.storyblok.com/oauth/token',
      callback: '/api/callback',
      oauth: 2,
      response: ['tokens'],
      scope: 'read_content write_content',
      // https://github.com/simov/grant#custom-parameters
      custom_params: {
        response_type: 'code',
        code_challenge: SHA256(codeIdentifier).toString(),
        code_challenge_method: 'S256',
        state: codeIdentifier,
      },
    },
    /* vercel: {
      key: process.env.VERCEL_CLIENT_ID,
      secret: process.env.VERCEL_CLIENT_SECRET,
      redirect_uri: process.env.CONFIDENTIAL_CLIENT_REDIRECT_URI,
      authorize_url: 'https://vercel.com/oauth/authorize',
      access_url: 'https://api.vercel.com/v2/oauth/access_token',
      oauth: 2,
      callback: '/api/callback',
    }, */
  },
  session: {
    secret: 'grant',
    cookie: {
      sameSite: 'none',
      path: '/',
      httpOnly: 'true',
      secure: true,
    },
    store: require('./store'),
  },
}
