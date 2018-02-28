/*
  This module has core functions for SLIP protocol:
  https://tools.ietf.org/html/rfc1055

  Author: Dmitry Myadzelets

  Assumptions:
  1. The beginning and the end of the data are unknown.Both encode and decode
  functions operate on chunks of data. The upper level should add END
  character at the end (and the beginning) of the data.
  2. Two bytes escape sequences are always in the same chunk during decoding.

  Encode and decode functions do not modify data. For such the `slice` and `add`
  functions should be provided.
*/

const END = 192
const ESC = 219
const ESC_END = 220
const ESC_ESC = 221

const buf = {
  end: new Uint8Array([END]),
  esc: new Uint8Array([ESC]),
  escend: new Uint8Array([ESC, ESC_END]),
  escesc: new Uint8Array([ESC, ESC_ESC])
}

function encode (chunk, slice, add) {
  let start, end
  for (start = 0, end = 0; end < chunk.length; end += 1) {
    switch (chunk[end]) {
      case ESC:
        (end > start) && slice(start, end)
        add(buf.escesc)
        start = end + 1
        break
      case END:
        (end > start) && slice(start, end)
        add(buf.escend)
        start = end + 1
        break
    }
  }
  (end > start) && slice(start, end)
}

function decode (chunk, slice, add) {
  let start, end
  let esc = false
  for (start = 0, end = 0; end < chunk.length; end += 1) {
    switch (chunk[end]) {
      case ESC_END:
        esc && (start = end + 1) && add(buf.end)
        break
      case ESC_ESC:
        esc && (start = end + 1) && add(buf.esc)
        break
      case END:
        (end > start) && slice(start, end)
        start = end + 1
        break
    }
    esc = chunk[end] === ESC
  }
  (end > start) && slice(start, end)
}

module.exports = { encode, decode }
module.exports.END = buf.end
