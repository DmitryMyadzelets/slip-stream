// Simple testing framework

const assert = require('assert')

// Set hook for every method of the 'assert'
// Warning: Doesn't hooks assert itself, use assert.ok()

let cnt = 0

function hook (o, fun) {
    // Create hooks for every function
  Object.getOwnPropertyNames(o).forEach(key => {
    if (typeof o[key] === 'function') {
      // console.log(typeof o[key], key)
      const f = o[key]
      o[key] = function () {
        fun()
        return f.apply(this, arguments)
      }
    }
  })
}

hook(assert, () => {
  cnt += 1
  console.log('passed', cnt)
})

Object.getOwnPropertyNames(assert).forEach(key => {
  module.exports[key] = assert[key]
})
