module.exports = async function ({ channel, commands }) {
  const safeChannelName = channel.replace(/^#/, '')
  const channelCommands = commands.channels[safeChannelName]
  let commandList = Object.keys(commands).filter(key => key !== 'channels')

  commandList = commandList.concat(Object.keys(channelCommands))

  return {
    say: `This is a list of all available commands: ${commandList.sort().join(', ')}`
  }
}
