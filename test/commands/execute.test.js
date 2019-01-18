import { expect } from 'chai'





import command from '../../src/commands/execute'
import commandData from '../mocks/commandData.mock'
import sharedTests from './shared.test'





describe('!execute', function () {
  sharedTests(command, { args: 'order 65' })

  describe('without an action', function () {
    beforeEach(async function () {
      return this.result = await command(commandData({ args: '' }))
    })

    it('should return a response', function () {
      expect(this.result.say).to.be.a('string')
    })

    it('should fail', function () {
      expect(this.result.success).to.be.false
    })
  })

  describe('order', function () {
    describe('with an order number', function () {
      it('should succeed', async function () {
        const result = await command(commandData({ args: 'order 65' }))
        expect(result.success).to.be.true
      })

      describe('65', function () {
        beforeEach(async function () {
          return this.result = await command(commandData({ args: 'order 65' }))
        })

        it('should return an action', function () {
          expect(this.result.action).to.be.a('string')
        })

        it('should get me a coffee from Starbucks', function () {
          expect(this.result.action).to.satisfy(response => {
            const containsCoffee = /coffee/.test(response)
            const containsStarbucks = /coffee/.test(response)

            return containsCoffee && containsStarbucks
          })
        })
      })

      describe('66', function () {
        beforeEach(async function () {
          return this.result = await command(commandData({ args: 'order 66' }))
        })

        it('should return an action', function () {
          expect(this.result.action).to.be.a('string')
        })

        it('should fire on Jedi', function () {
          expect(this.result.action).to.include('Jedi')
        })
      })
    })

    describe('without an order number', function () {
      beforeEach(async function () {
        return this.result = await command(commandData({ args: 'order' }))
      })

      it('should return a response', function () {
        expect(this.result.say).to.be.a('string')
      })

      it('should fail', function () {
        expect(this.result.success).to.be.false
      })
    })
  })
})
