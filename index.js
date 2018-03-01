const { Transform } = require('stream')
const { encode, decode, END } = require('./slip')

function callback (cb) {
  return (typeof cb === 'function') ? cb : () => {}
}

const proto = {
  slice: function (chunk, start, end) {
    this.push(chunk.slice(start, end))
  },
  add: function (data) {
    this.push(data)
  }
}

const encoder = () => {
  let slice, add
  const stream = new Transform({
    transform: function (chunk, enc, cb) {
      encode(chunk, slice, add)
      cb()
    },
    flush: function (cb) {
      this.push(END)
      cb()
    }
  })
  slice = proto.slice.bind(stream)
  add = proto.add.bind(stream)
  return stream
}

const decoder = (eof) => {
  let slice, add
  const stream = new Transform({
    transform: function (chunk, enc, cb) {
      decode(chunk, slice, add, eof)
      cb()
    }
  })
  slice = proto.slice.bind(stream)
  add = proto.add.bind(stream)
  eof = callback(eof).bind(stream)
  return stream
}

module.exports = { encoder, decoder }
