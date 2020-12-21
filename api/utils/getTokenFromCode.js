const qs = require('qs')
const axios = require('axios')

module.exports = function getTokenFromCode({
  code,
  provider = 'storyblok',
  refresh_token,
  grant_type = 'authorization_code',
}) {
  const providers = {
    storyblok: {
      key: process.env.SB_CLIENT_ID,
      secret: process.env.SB_CLIENT_SECRET,
      redirect_uri: process.env.BASE_URL + '/sb-callback',
      access_url: 'https://app.storyblok.com/oauth/token',
    },
    netlify: {
      key: process.env.NETLIFY_CLIENT_ID,
      secret: process.env.NETLIFY_CLIENT_SECRET,
      redirect_uri: process.env.BASE_URL + '/netlify-callback',
      access_url: 'https://api.netlify.com/oauth/token',
    },
  }

  return new Promise((resolve, reject) => {
    const requestConfig = {
      url: providers[provider].access_url,
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify({
        grant_type,
        code,
        refresh_token,
        client_id: providers[provider].key,
        client_secret: providers[provider].secret,
        redirect_uri: providers[provider].redirect_uri,
      }),
    }

    axios(requestConfig)
      .then((response) => {
        const { access_token, refresh_token } = response.data

        resolve({
          access_token,
          refresh_token,
        })
      })
      .catch(reject)
  })
}