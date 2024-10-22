const Session = require('grant/lib/session')({
  secret: 'grant',
  store: require('../auth/store'),
})
const getTokenFromCode = require('../auth/util')

export default async function (req, res) {
  req.cookies = [req.cookies]
  const session = Session(req)
  const sessionEntry = await session.get()

  try {
    const { code, space_id } = req.query
    const { access_token, refresh_token } = await getTokenFromCode({
      code,
      provider: 'storyblok',
      grant_type: 'authorization_code',
    })
    const fullEntry = Object.assign({}, sessionEntry, {
      space_id,
      application_code: code,
      access_token,
      refresh_token,
    })

    await session.set(fullEntry)

    res.redirect(`/?space_id=${space_id}`)
  } catch (e) {
    const statusCode = e.response ? e.response.status : 500
    res.status(statusCode).json({ error: e.message })
  }
}
