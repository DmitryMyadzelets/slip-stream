const assert = require('./assert')
const slip = require('..')
const fs = require('fs')
const path = require('path')

const rname = path.join(__dirname, 'index.js')
const wname = path.join(__dirname, 'out.tmp')
const reader = fs.ReadStream(rname)
const writer = fs.WriteStream(wname)

let eof = false

const encoder = slip.encoder()
const decoder = slip.decoder(() => eof = true)

writer.on('close', () => {
  // End of file was detected
  assert.equal(eof, true)
  // The files are of the same size
  assert.equal(fs.lstatSync(rname).size, fs.lstatSync(wname).size)
  // Delete the temporary file
  fs.unlinkSync(wname)
})

reader.pipe(encoder).pipe(decoder).pipe(writer)
