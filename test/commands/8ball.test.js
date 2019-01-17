import { expect } from 'chai'





import '../mocks/requires/firebase-credentials.mock'
import command from '../../src/commands/8ball'
import User from '../../src/structures/User'
import userstate from '../mocks/userstate.mock'
import sharedTests from './shared.test'





describe('!8ball', function () {
  sharedTests(command)

  describe('with a query', function () {
    beforeEach(function () {
      this.result = command({
        args: 'Will I ever fall in love?',
        user: new User(userstate),
      })
    })

    it('should succeed', function () {
      expect(this.result.success).to.be.true
    })
  })

  describe('without a query', function () {
    beforeEach(function () {
      this.result = command({
        args: '',
        user: new User(userstate),
      })
    })

    it('should fail', function () {
      expect(this.result.success).to.be.false
    })
  })
})
