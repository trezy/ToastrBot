// Module imports
import path from 'path'
import uuid from 'uuid/v4'





// Local imports
import Command from './Command'
import logger from '../logger'





class TwitchCommand extends Command {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _afterExecute = (messageData, result, logGroupID) => {
    const { channel, commandName, user } = messageData
    let delayTime = 0

    if ((typeof result.success === 'undefined') || result.success) {
      logger.info(`${user.atName}'s attempt to execute \`${commandName}\` in \`${channel.name}\` was successful - executing command functions...`, {
        group: logGroupID,
        result,
        success: true,
      })
    } else {
      logger.info(`${user.atName}'s attempt to execute \`${commandName}\` in \`${channel.name}\` was unsuccessful`, {
        group: logGroupID,
        result,
        success: false,
      })
    }

    for (const [key, value] of Object.entries(result)) {
      let valueAsArray = value

      if (['action', 'say'].includes(key)) {
        if (!Array.isArray(value)) {
          valueAsArray = [value]
        }

        for (const item of valueAsArray) {
          setTimeout(() => {
            this.twitch[key](channel.name, item)
          }, delayTime)

          delayTime += 500
        }
      }
    }

    setTimeout(() => logger.info(`Command functions have been queued`, { group: logGroupID }), delayTime)
  }

  _beforeExecute = (messageData, logGroupID) => {
    const { args, channel, commandName, user } = messageData

    logger.info(`${user.atName} is attempting to execute \`${commandName}\` in \`${channel.name}\``, {
      args,
      channel: channel.name,
      commandName,
      group: logGroupID,
      user: user.name,
    })
  }
}





export default TwitchCommand
