module.exports = function ({ commands }) {
  return {
    say: `This is a list of all available commands: ${Object.keys(commands).join(', ')}`
  }
}
