
// SLIP encoder & decoder

const slip = require('..')
let eof = false
const encoder = slip.encoder()
const decoder = slip.decoder(function () {
  eof = true
  // Writing null we say to underlining process that the stream is ended
  this.push(null)
})

// Files

const fs = require('fs')
const path = require('path')

const rname = path.join(__dirname, 'index.js')
const wname = path.join(__dirname, 'out.ws.tmp')
const reader = fs.ReadStream(rname)
const writer = fs.WriteStream(wname)

// Websocket

const WebSocket = require('ws')
const url = 'ws://echo.websocket.org'
const ws = new WebSocket(url)
const wsstream = require('./ws-stream')(ws)
ws
  .on('open', () => console.log('Websocket is connected to ', url))
  .on('close', () => console.log('Websocket is disconnected'))

// Testing

const assert = require('./assert')
writer.on('close', () => {
  // The end of file is detected
  assert.equal(eof, true)
  // The files are of the same size
  assert.equal(fs.lstatSync(rname).size, fs.lstatSync(wname).size)
  // Delete the temporary file
  fs.unlinkSync(wname)
  // Close the websocket
  ws.close()
})

// The pipe

reader.pipe(encoder).pipe(wsstream).pipe(decoder).pipe(writer)
