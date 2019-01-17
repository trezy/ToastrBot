import { expect } from 'chai'





import command from '../../src/commands/commands'
import commandData from '../mocks/commandData.mock'
import sharedTests from './shared.test'





describe('!commands', function () {
  sharedTests(command)

  beforeEach(async function () {
    this.result = await command(commandData())
  })

  it('should return a list of commands', function () {
    expect(this.result.say).to.be.a('string')
  })
})
