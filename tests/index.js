// ============================================================================
// Simple testing framework

const assert = require('assert')

// Set hook for every method of the 'assert'
// Warning: Doesn't hooks assert itself, use assert.ok()

function init () {
  let cnt = 0

  function hook (o, fun) {
    // Create hooks for every function
    Object.getOwnPropertyNames(o).forEach(function (key) {
      if (typeof o[key] === 'function') {
        const f = o[key]
        o[key] = function () {
          fun()
          return f.apply(this, arguments)
        }
      }
    })
  }

  hook(assert, function () {
    cnt += 1
    console.log('passed', cnt)
  })
}

init()

const equal = (a, b) =>
  (a.length === b.length) && a.reduce((res, v, i) => res && (v === b[i]), true)

// ============================================================================

const slip = require('..')

const encoder = slip.encoder()
const decoder = slip.decoder()

const input = [1, 219, 2, 192, 3, 4]
const encoded = []
const decoded = []

// Identity test
assert.ok(equal(input, input))

// Output differs from the input
assert.ok(!equal(input, encoded))
assert.ok(!equal(input, decoded))

encoder
  .on('data', data => encoded.push.apply(encoded, data))
  .on('end', () => console.log('encoded', encoded))

decoder
  .on('data', data => decoded.push.apply(decoded, data))
  .on('end', () => console.log('decoded', decoded))
  .on('end', () => {
    // Make sure we don't just copy it
    assert.ok(!equal(input, encoded))
    // The ouput is equal to the input
    assert.ok(equal(input, decoded))
  })

encoder.pipe(decoder)

encoder.write(Buffer.from(input))
encoder.end()

console.log('input  ', input)
