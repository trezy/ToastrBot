export default ({ args, user }) => {
  const response = {}

  if (/^order/.test(args)) {
    switch (/^order ?(\d+)/.exec(args)[1]) {
      case '65':
        response.action = `gets ${user.atName} a coffee from Starbucks.`
        break
      case '66':
        response.action = `fires upon all nearby Jedi.`
        break
    }
  }

  return response
}
