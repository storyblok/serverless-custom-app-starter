/* eslint-disable camelcase */
const qs = require('qs')
const axios = require('axios')
const grantConfig = require('./grantconfig.js')

module.exports = function getTokenFromCode({
  code,
  provider = 'storyblok',
  refresh_token,
  grant_type = 'authorization_code',
}) {
  const providerConfig = grantConfig.config[provider]
  return new Promise((resolve, reject) => {
    const requestConfig = {
      url: providerConfig.access_url,
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify({
        grant_type,
        code,
        refresh_token,
        client_id: providerConfig.key,
        client_secret: providerConfig.secret,
        redirect_uri: providerConfig.redirect_uri,
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
