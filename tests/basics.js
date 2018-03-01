const assert = require('./assert')
const slip = require('..')

let eof = false
const encoder = slip.encoder()
const decoder = slip.decoder(() => eof = true)

const input = [1, 219, 2, 192, 3, 4]
const encoded = []
const decoded = []

// Output differs from the input
assert.notDeepStrictEqual(input, encoded)
assert.notDeepStrictEqual(input, decoded)

encoder
  .on('data', data => encoded.push.apply(encoded, data))
  .on('end', () => console.log('encoded', encoded))

decoder
  .on('data', data => decoded.push.apply(decoded, data))
  .on('end', () => console.log('decoded', decoded))
  .on('end', () => {
    // Make sure we don't just copy it
    assert.notDeepStrictEqual(input, encoded)
    // The ouput is equal to the input
    assert.deepStrictEqual(input, decoded)
    assert.equal(eof, true)
  })

encoder.pipe(decoder)

encoder.write(Buffer.from(input))
encoder.end()

console.log('input  ', input)
