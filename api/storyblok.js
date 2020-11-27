const StoryblokClient = require('storyblok-js-client/dist/es5/index.cjs')
const Session = require('grant/lib/session')({
  secret: 'grant',
  store: require('../auth/store'),
})

function getEndpointUrl(url, session) {
  let endpointUrl = url.replace('/auth/', '').replace('null', session.space_id)

  if (url.includes('user')) endpointUrl = 'oauth/user_info'

  return endpointUrl
}

export default async (req, res) => {
  req.cookies = [req.cookies]
  // get the current session
  const session = Session(req)
  const sessionEntry = await session.get()
  const url = getEndpointUrl(req.url, sessionEntry)

  if (sessionEntry && typeof sessionEntry.access_token !== 'undefined') {
    // get storyblok request
    const sbClient = new StoryblokClient({
      oauthToken: `Bearer ${sessionEntry.access_token}`,
    })

    try {
      const { data, perPage, total } = await sbClient.get(url)
      res.json({ perPage, total, ...data })
    } catch (e) {
      const statusCode = e.response ? e.response.status : 500
      res.status(statusCode).json({ error: e.message })
    }
  } else {
    res.json({ error: 'No session found' })
  }
}
