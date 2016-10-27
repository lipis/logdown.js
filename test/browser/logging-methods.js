/* global describe, afterEach, beforeEach, console, it, require, window,
   Logdown, chai, sinon, xit */

;(function () {
  'use strict'

  sinon.assert.expose(chai.assert, {prefix: ''})
  var assert = chai.assert

  var methods = ['debug', 'log', 'info', 'warn', 'error']
  methods.forEach(function (method) {
    describe('Logdown::' + method, function () {
      var sandbox

      beforeEach(function () {
        sandbox = sinon.sandbox.create()
        sandbox.stub(window.console, method)

        Logdown.enable('*')
      })

      afterEach(function () {
        sandbox.restore()
      })

      it('should parse markdown if enabled', function () {
        try {
          var foo = new Logdown({markdown: true})

          foo[method]('lorem *ipsum*')
          assert.calledWith(
            console[method],
            'lorem %cipsum%c',
            'font-weight:bold;',
            'color:inherit;'
          )

          foo[method]('lorem _ipsum_')
          assert.calledWith(
            console[method],
            'lorem %cipsum%c',
            'font-style:italic;',
            'color:inherit;'
          )

          foo[method]('lorem `ipsum`')
          assert.calledWith(
            console[method],
            'lorem %cipsum%c',
            'background:#FDF6E3; color:#586E75; padding:1px 5px; ' +
              'border-radius:4px;',
            'color:inherit;'
          )

          foo[method]('lorem `ipsum` *dolor* sit _amet_')
          assert.calledWith(
            console[method],
            'lorem %cipsum%c %cdolor%c sit %camet%c',
            'background:#FDF6E3; color:#586E75; padding:1px 5px; ' +
              'border-radius:4px;',
            'color:inherit;',
            'font-weight:bold;',
            'color:inherit;',
            'font-style:italic;',
            'color:inherit;'
          )
        } catch (error) {
          sandbox.restore()
          throw error
        }

        sandbox.restore()
      })

      it('should not parse markdown if disabled', function () {
        try {
          var foo = new Logdown({markdown: false})

          foo[method]('lorem *ipsum*')
          assert.calledWith(
            console[method],
            'lorem *ipsum*'
          )

          foo[method]('lorem _ipsum_ dolor')
          assert.calledWith(
            console[method],
            'lorem _ipsum_ dolor'
          )

          foo[method]('lorem `ipsum` dolor')
          assert.calledWith(
            console[method],
            'lorem `ipsum` dolor'
          )
        } catch (error) {
          sandbox.restore()
          throw error
        }

        sandbox.restore()
      })

      it('should sanitize forbidden characters', function () {
        sandbox.restore()
      })

      it('should print prefix if present', function () {
        // var foo = new Logdown({prefix: 'foo'})

        // foo[method]('lorem ipsum')
        // try {
        //   assert.calledWith(
        //     console[method],
        //     '%cfoo%c lorem ipsum',
        //     'color:' + foo.prefixColor + '; font-weight:bold;',
        //     ''
        //   )
        // } catch (error) {
        //   sandbox.restore()
        //   throw error
        // }

        sandbox.restore()
      })

      it('should sanitize strings', function () {
        try {
          var foo = new Logdown()
          foo[method]('lorem %cipsum%c sit %cdolor%c amet')
          assert.calledWith(console[method], 'lorem ipsum sit dolor amet')

          // var bar = new Logdown({prefix: 'bar'})
          // bar.log('lorem %cipsum% sit %cdolor% amet')
          // assert.calledWith(
          //   console[method],
          //   '%c' + bar.prefix + '%clorem ipsum sit dolor amet',
          //   'color:' + bar.prefixColor + '; font-weight:bold;',
          //   ''
          // )
        } catch (error) {
          sandbox.restore()
          throw error
        }

        sandbox.restore()
      })

      it('can add whitespace to align logger output', function () {
        try {
          var abc = new Logdown({prefix: 'abc'})
          var demo = new Logdown({prefix: 'demo', alignOuput: true})
          var longDemo = new Logdown({prefix: 'longDemo', alignOuput: true})
          var longerDemo = new Logdown({prefix: 'longerDemo', alignOuput: true})

          assert.equal(abc.prefix.length, 3, 'Skipping \'alignOuput\' will not add whitespace characters')
          assert.equal(demo.prefix.length, 10, 'Padding will be added to make short names as long as the longest')
          assert.equal(longDemo.prefix.length, 10, 'Padding will be added to make long names as long as the longest')
          assert.equal(longerDemo.prefix.length, 10, 'The longest name will set the width for every other logger name')
        } catch (error) {
          sandbox.restore()
          throw error
        }
        sandbox.restore()
      })

      // https://github.com/caiogondim/logdown/issues/14
      xit('should print not-string arguments as is', function () {
        try {
          var foo = new Logdown()
          var obj = {foo: 1, bar: 2}
          foo[method](obj)
          assert.calledWith()
        } catch (error) {
          sandbox.restore()
          throw error
        }

        sandbox.restore()
      })

      // it('should not print special characters if the enviroment does not ' +
      //    'support colors', function() {
      //   try {
      //     mockIEEnviroment()

      //     var bar = new Logdown()
      //     bar[method]('lorem *ipsum* dolor sit _amet_')
      //     assert.calledWith(
      //       console[method],
      //       'lorem *ipsum* dolor sit _amet_'
      //     )

      //     var foo = new Logdown({prefix: 'foo'})
      //     foo[method]('lorem *ipsum* dolor sit _amet_ foo bar `var foo = 1`')
      //     assert.calledWith(
      //       console[method],
      //       '[foo] lorem *ipsum* dolor sit _amet_ foo bar `var foo = 1`'
      //     )
      //   } catch (error) {
      //     mockWebkitEnviroment()
      //     sandbox.restore()
      //     throw error
      //   }

      //   mockWebkitEnviroment()
      //   sandbox.restore()
      // })

      // if (method === 'info' || method === 'warn' || method === 'error') {
      //   it('should prepend symbols on node.js', function() {
      //     unmockBrowserEnviroment()

      //     var bar = new Logdown()
      //     bar[method]('lorem *ipsum* dolor sit _amet_')
      //     assert.calledWith(
      //       console[method],
      //       'lorem *ipsum* dolor sit _amet_'
      //     )
      //   })
      // }
    })
  })
}())
