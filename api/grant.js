const SHA256 = require('crypto-js/sha256')
const { v4: uuid } = require('uuid')
const codeIdentifier = uuid()

const grant = require('grant').vercel({
  config: {
    defaults: {
      origin: 'http://localhost:3000',
    },
    storyblok: {
      key: process.env.CONFIDENTIAL_CLIENT_ID,
      secret: process.env.CONFIDENTIAL_CLIENT_SECRET,
      redirect_uri: process.env.CONFIDENTIAL_CLIENT_REDIRECT_URI,
      authorize_url: 'https://app.storyblok.com/oauth/authorize',
      access_url: 'https://app.storyblok.com/oauth/token',
      oauth: 2,
      callback: '/api/callback',
      scope: 'read_content write_content',
      // create some custom parameters to send in URL
      // https://github.com/simov/grant#custom-parameters
      // this additional parameters are explain in Storyblok OAuth documentation
      custom_params: {
        code_challenge: SHA256(codeIdentifier).toString(),
        code_challenge_method: 'S256',
        state: codeIdentifier,
      },
    },
  },
  session: { secret: 'grant' },
})

module.exports = async (req, res) => {
  req.cookies = Array.from(req.cookies)
  const { response } = await grant(req, res)
  if (response) {
    res.statusCode = 200
    res.setHeader('content-type', 'text/plain')
    res.end(JSON.stringify(response, null, 2))
  }
}
