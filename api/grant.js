/* eslint-disable camelcase */
const grant = require('grant')
const grantConfig = require('../auth/grantconfig.js')
const grantClient = grant.vercel(grantConfig)

module.exports = async (req, res) => {
  req.cookies = [req.cookies] // this is necessary because of a grant error on vercel
  await grantClient(req, res)
}
