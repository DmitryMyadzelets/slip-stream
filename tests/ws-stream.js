const { Duplex } = require('stream')

module.exports = (socket, onmessage) => {
  function write (chunk, enc, cb) {
    if (socket.readyState === socket.OPEN) {
      socket.send(chunk, cb)
    } else {
      socket.once('open', ignore => write(chunk, enc, cb))
    }
  }

  const stream = new Duplex({
    read: size => {},
    write: write,
    final: cb => cb()
  })

  socket.on('message', onmessage || (chunk => stream.push(chunk)))

  return stream
}
