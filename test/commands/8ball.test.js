import { expect } from 'chai'





import command from '../../src/commands/8ball'
import commandData from '../mocks/commandData.mock'
import sharedTests from './shared.test'





describe('!8ball', function () {
  sharedTests(command)

  describe('with a query', function () {
    beforeEach(async function () {
      return this.result = await command(commandData({ args: 'Will I ever fall in love?' }))
    })

    it('should succeed', function () {
      expect(this.result.success).to.be.true
    })
  })

  describe('without a query', function () {
    beforeEach(async function () {
      return this.result = await command(commandData({ args: '' }))
    })

    it('should fail', function () {
      expect(this.result.success).to.be.false
    })
  })
})
