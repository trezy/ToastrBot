module.exports = function ({
  args,
  channel,
  command,
  message,
  self,
  userstate,
}) {
  const response = {}

  if (/^order/.test(args)) {
    switch (/^order ?(\d+)/.exec(args)[1]) {
      case '65':
        response.action = `gets ${userstate['display-name']} a coffee from Starbucks.`
        break
      case '66':
        response.action = `fires upon all nearby Jedi.`
        break
    }
  }

  return response
}
