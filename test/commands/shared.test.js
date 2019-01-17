import { expect } from 'chai'





import commandData from '../mocks/commandData.mock'





export default function (command, options = {}) {
  it('should be a function', function () {
    expect(command).to.be.a('function')
  })

  describe('responses', function () {
    beforeEach(async function () {
      return this.result = await command(commandData(options))
    })

    it('should be an object', function () {
      return expect(this.result).to.be.an('object')
    })

    it('should contain a value indicating success', function () {
      return expect(this.result).to.have.property('success')
    })

    it('should contain a string to be posted to chat', function () {
      return expect(this.result).to.have.property('say')
    })
  })
}
