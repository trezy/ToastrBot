import chai, { expect } from 'chai'
import sinonChai from 'sinon-chai'





import command from '../../src/commands/mods'
import commandData from '../mocks/commandData.mock'
import sharedTests from './shared.test'





chai.use(sinonChai)





describe('!mods', function () {
  sharedTests(command)

  beforeEach(async function () {
    this.commandData = commandData({ args: 'Will I ever fall in love?' })
    return this.result = await command(this.commandData)
  })

  it('should succeed', function () {
    expect(this.result.success).to.be.true
  })

  it('should call the `mods()` method from the Twitch SDK', function () {
    const { twitch: twitchMock } = this.commandData.bot

    expect(twitchMock.mods).to.have.been.calledOnce
  })
})
