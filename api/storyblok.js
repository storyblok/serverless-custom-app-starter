const StoryblokClient = require('storyblok-js-client/dist/es5/index.cjs')
const Session = require('grant/lib/session')({
  name: 'my-cookie-name',
  secret: 'my-cookie-secret-123',
  store: require('./utils/store'),
})

// this functions allows to route specific requests to specific endpoints
function getEndpointUrl(url) {
  let endpointUrl = url.replace('/auth/', '')

  if (url.includes('user')) {
    endpointUrl = 'oauth/user_info'
  }

  return endpointUrl
}

exports.handler = async (event) => {
  const session = Session(event)
  const sessionEntry = await session.get()
  const url = getEndpointUrl(event.path)

  // we can only make requests to Storyblok if a session and an access token is present
  if (
    sessionEntry &&
    sessionEntry.storyblok &&
    sessionEntry.storyblok.access_token
  ) {
    // get storyblok client
    const sbClient = new StoryblokClient({
      oauthToken: `Bearer ${sessionEntry.storyblok.access_token}`,
    })

    // load the data from the given URL on the request
    try {
      const response = await sbClient.get(url)
      return {
        statusCode: response.status,
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(response.data, null, 2),
      }
    } catch (e) {
      const statusCode = e.response ? e.response.status : 500
      return {
        statusCode,
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ error: e.message }, null, 2),
      }
    }
  } else {
    return {
      statusCode: 500,
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ error: 'No session found' }, null, 2),
    }
  }
}
