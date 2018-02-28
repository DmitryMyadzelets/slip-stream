const { Transform } = require('stream')
const { encode, decode, END } = require('./slip')

function slice (chunk, start, end) {
  this.push(chunk.slice(start, end))
}

const encoder = () => new Transform({
  transform: function (chunk, enc, cb) {
    encode(chunk, slice.bind(this, chunk), this.push.bind(this))
    cb()
  },
  flush: function (cb) {
    this.push(END)
    cb()
  }
})

const decoder = () => new Transform({
  transform: function (chunk, enc, cb) {
    decode(chunk, slice.bind(this, chunk), this.push.bind(this))
    cb()
  }
})

module.exports = { encoder, decoder }
