const grant = require('grant')
const SHA256 = require('crypto-js/sha256')
const uuid = require('uuid')
const codeIdentifier = uuid.v4()

const grantClient = grant.aws({
  config: {
    defaults: {
      origin: 'http://localhost:3000',
      prefix: '/connect',
      transport: 'session',
    },
    storyblok: {
      key: process.env.SB_CLIENT_ID,
      secret: process.env.SB_CLIENT_SECRET,
      redirect_uri: process.env.BASE_URL + '/sb-callback',
      authorize_url: 'https://app.storyblok.com/oauth/authorize',
      access_url: 'https://app.storyblok.com/oauth/token',
      callback: process.env.BASE_URL + '/sb-callback',
      oauth: 2,
      response: ['tokens'],
      scope: 'read_content',
      // https://github.com/simov/grant#custom-parameters
      custom_params: {
        response_type: 'code',
        code_challenge: SHA256(codeIdentifier).toString(),
        code_challenge_method: 'S256',
        state: codeIdentifier,
      },
    },
    netlify: {
      key: process.env.NETLIFY_CLIENT_ID,
      secret: process.env.NETLIFY_CLIENT_SECRET,
      redirect_uri: process.env.BASE_URL + '/netlify-callback',
      authorize_url: 'https://app.netlify.com/authorize',
      access_url: 'https://api.netlify.com/oauth/token',
      oauth: 2,
      callback: '/netlify-callback',
      scope: '',
      custom_params: {
        response_type: 'code',
        state: codeIdentifier,
      },
    },
  },
  session: {
    name: 'my-cookie-name',
    secret: 'my-cookie-secret-123',
    cookie: {
      sameSite: 'none',
      path: '/',
      httpOnly: 'true',
      secure: true,
    },
    store: require('./utils/store'),
  },
})

exports.handler = async (event) => {
  event.version = '1.0' // for grant to set the correct path on AWS
  const { redirect, response } = await grantClient(event)
  return (
    redirect || {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(response),
    }
  )
}
