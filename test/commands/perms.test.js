import chai, { expect } from 'chai'
import sinonChai from 'sinon-chai'





import command from '../../src/commands/perms'
import commandData from '../mocks/commandData.mock'
import sharedTests from './shared.test'





chai.use(sinonChai)





describe('!perms', function () {
  sharedTests(command, { args: '' })

  describe('add', function () {
    describe('without a command name', function () {
      beforeEach(async function () {
        this.commandData = commandData({ args: 'add' })
        return this.result = await command(this.commandData)
      })

      it('should fail', function () {
        expect(this.result.success).to.be.false
      })
    })

    describe('with a command name that doesn\'t exist', function () {
      beforeEach(async function () {
        this.commandData = commandData({ args: 'add blep broadcaster' })
        return this.result = await command(this.commandData)
      })

      it('should fail', function () {
        expect(this.result.success).to.be.false
      })
    })

    describe('with a command name that exists', function () {
      describe('without a permissions list', function () {
        beforeEach(async function () {
          this.commandData = commandData({ args: 'add blep' })
          return this.result = await command(this.commandData)
        })

        it('should fail', function () {
          expect(this.result.success).to.be.false
        })
      })

      describe('with a permissions list', function () {
        beforeEach(async function () {
          this.commandData = commandData({
            args: 'add blep broadcaster',
            commands: {
              blep: () => {},
            },
          })
          return this.result = await command(this.commandData)
        })

        it('should succeed', function () {
          expect(this.result.success).to.be.true
        })

        it('should return an affirmative response', function () {
          expect(this.result.say).to.be.a('string')
        })
      })
    })
  })

  describe('remove', function () {
    describe('without a command name', function () {
      beforeEach(async function () {
        this.commandData = commandData({ args: 'remove' })
        return this.result = await command(this.commandData)
      })

      it('should fail', function () {
        expect(this.result.success).to.be.false
      })
    })

    describe('with a command name that doesn\'t exist', function () {
      beforeEach(async function () {
        this.commandData = commandData({ args: 'remove blep broadcaster' })
        return this.result = await command(this.commandData)
      })

      it('should fail', function () {
        expect(this.result.success).to.be.false
      })
    })

    describe('with a command name that exists', function () {
      describe('without a permissions list', function () {
        beforeEach(async function () {
          this.commandData = commandData({ args: 'remove blep' })
          return this.result = await command(this.commandData)
        })

        it('should fail', function () {
          expect(this.result.success).to.be.false
        })
      })

      describe('with a permissions list for a command with no permissions set', function () {
        beforeEach(async function () {
          this.commandData = commandData({
            args: 'remove blep broadcaster',
            commands: {
              blep: () => {},
            },
          })
          return this.result = await command(this.commandData)
        })

        it('should fail', function () {
          expect(this.result.success).to.be.false
        })
      })

      describe('with a permissions list for a command with permissions set', function () {
        beforeEach(async function () {
          this.commandData = commandData({
            args: 'remove blep broadcaster',
            commands: {
              blep: () => {},
            },
          })

          this.commandData.channel.permissions = { blep: ['moderator'] }

          return this.result = await command(this.commandData)
        })

        it('should succeed', function () {
          expect(this.result.success).to.be.true
        })

        it('should return an affirmative response', function () {
          expect(this.result.say).to.be.a('string')
        })
      })
    })
  })

  describe('list', function () {
    describe('without a command name', function () {
      beforeEach(async function () {
        this.commandData = commandData({ args: 'remove' })
        return this.result = await command(this.commandData)
      })

      it('should fail', function () {
        expect(this.result.success).to.be.false
      })
    })

    describe('with a command name that doesn\'t exist', function () {
      beforeEach(async function () {
        this.commandData = commandData({ args: 'add blep broadcaster' })
        return this.result = await command(this.commandData)
      })

      it('should fail', function () {
        expect(this.result.success).to.be.false
      })
    })

    describe('with a command name that exists', function () {
      beforeEach(async function () {
        this.commandData = commandData({
          args: 'list blep',
          commands: {
            blep: () => {},
          },
        })
        return this.result = await command(this.commandData)
      })

      it('should succeed', function () {
        expect(this.result.success).to.be.true
      })

      it('should return an affirmative response', function () {
        expect(this.result.say).to.be.a('string')
      })
    })
  })
})
