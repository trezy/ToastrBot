import { expect } from 'chai'





import User from '../../src/structures/User'
import userstate from '../mocks/userstate.mock'





const defaultOptions = {
  args: null,
  bot: {},
  channel: {},
  commands: {},
  user: new User(userstate),
}





export default function (command, options = {}) {
  const compiledOptions = {
    ...defaultOptions,
    ...options,
  }

  it('should be a function', function () {
    expect(command).to.be.a('function')
  })

  describe('responses', function () {
    const result = command(compiledOptions)

    it('should be an object', function () {
      expect(result).to.be.an('object')
    })

    it('should contain a value indicating success', function () {
      expect(result.success).to.be.a('boolean')
    })

    it('should contain a string to be posted to chat', function () {
      expect(result.say).to.be.a('string')
    })
  })
}
