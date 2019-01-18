import { expect } from 'chai'





import command from '../../src/commands/commands'
import commandData from '../mocks/commandData.mock'
import getLocalCommands from '../../src/helpers/getLocalCommands'
import sharedTests from './shared.test'





describe('!commands', function () {
  sharedTests(command)

  beforeEach(async function () {
    this.result = await command(commandData())
  })

  it('should return a list of commands', function () {
    expect(this.result.say).to.be.a('string')
  })

  it('should include all local commands in the list of commands', function () {
    const localCommands = Object.keys(getLocalCommands({ firebase: {}, twitch: {} }))

    expect(this.result.say).to.satisfy(response => {
      return localCommands.every(localCommand => new RegExp(` ${localCommand}(?:, )?`).test(response))
    })
  })
})
