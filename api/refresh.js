/* eslint-disable camelcase */
const Session = require('grant/lib/session')({
  secret: 'grant',
  store: require('../auth/store'),
})
const getTokenFromCode = require('../auth/util.js')

export default async function (req, res) {
  req.cookies = [req.cookies]
  const session = Session(req)
  const sessionEntry = await session.get()

  try {
    const currentRefreshToken = sessionEntry.refresh_token
    const { access_token, refresh_token } = await getTokenFromCode({
      refresh_token: currentRefreshToken,
      provider: 'storyblok',
      grant_type: 'refresh_token',
    })

    const fullEntry = Object.assign({}, sessionEntry, {
      access_token,
      refresh_token,
    })
    await session.set(fullEntry)

    res.redirect(`/?space_id=${req.query.space_id}`)
  } catch (e) {
    const statusCode = e.response ? e.response.status : 500
    res.status(statusCode).json({ error: e.message })
  }
}
