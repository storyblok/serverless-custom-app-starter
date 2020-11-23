export default (request, response) => {
  response.send({
    data: `hello, ${request.query.name || 'world'}`,
  })
}
