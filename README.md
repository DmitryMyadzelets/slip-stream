# slip-stream

[RFC 1055 (SLIP)](https://tools.ietf.org/html/rfc1055) compliant endoding and decoding streams for Node.js

## Usage

```js
const slip = require('slip-stream')

const encoder = slip.encoder()
const decoder = slip.decoder()

const input = [1, 219, 2, 192, 3, 4]
const encoded = []
const decoded = []

encoder
  .on('data', data => encoded.push.apply(encoded, data))
  .on('end', () => console.log('encoded', encoded))

decoder
  .on('data', data => decoded.push.apply(decoded, data))
  .on('end', () => console.log('decoded', decoded))

encoder.pipe(decoder)

encoder.write(Buffer.from(input))
encoder.end()

console.log('input  ', input)

```

Output:

```sh
input   [ 1, 219, 2, 192, 3, 4 ]
encoded [ 1, 219, 221, 2, 219, 220, 3, 4, 192 ]
decoded [ 1, 219, 2, 192, 3, 4 ]
```

## License
MIT