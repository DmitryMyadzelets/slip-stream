const { Transform } = require('stream')
const { encode, decode, END } = require('./slip')

function callback (cb) {
  return (typeof cb === 'function') ? cb : () => {}
}

function slice (chunk, start, end) {
  this.push(chunk.slice(start, end))
}

function add (data) {
  this.push(data)
}

const encoder = () => {
  let _slice, _add
  const stream = new Transform({
    transform: function (chunk, enc, cb) {
      encode(chunk, _slice, _add)
      cb()
    },
    flush: function (cb) {
      this.push(END)
      cb()
    }
  })
  _slice = slice.bind(stream)
  _add = add.bind(stream)
  return stream
}

const decoder = (eof) => {
  let _slice, _add
  const stream = new Transform({
    transform: function (chunk, enc, cb) {
      decode(chunk, _slice, _add, callback(eof))
      cb()
    }
  })
  _slice = slice.bind(stream)
  _add = add.bind(stream)
  return stream
}

module.exports = { encoder, decoder }
