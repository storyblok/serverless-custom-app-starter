const Session = require('grant/lib/session')({
  name: 'my-cookie-name',
  secret: 'my-cookie-secret-123',
  store: require('./utils/store'),
})
const getTokenFromCode = require('./utils/getTokenFromCode')

exports.handler = async (event) => {
  event.version = '1.0'
  const session = Session(event)

  try {
    const { code, space_id } = event.queryStringParameters
    // get the access token from the code parameter
    const { access_token, refresh_token } = await getTokenFromCode({
      code,
      provider: 'storyblok',
      grant_type: 'authorization_code',
    })

    // set the access token in the session to use in other serverless functions
    await session.set({
      storyblok: {
        space_id,
        code,
        access_token,
        refresh_token,
      },
    })

    return {
      statusCode: 302,
      headers: {
        Location: process.env.BASE_URL + `/?space_id=${space_id}`,
      },
      body: null,
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
}
