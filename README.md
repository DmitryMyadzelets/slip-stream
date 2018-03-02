# slip-stream

[RFC 1055 (SLIP)](https://tools.ietf.org/html/rfc1055) compliant encoding and decoding streams for Node.js

## Why

Think about sending files as binary data over a WebSocket. The problem is to detect the end of the data. The SLIP solves it, and the streams just make it simple.

The client could be (preparation is omitted):

```js
file.pipe(encoder).pipe(websocket)
```

And the server:

```js
websocket.pipe(decoder).pipe(file)
```

The tests contain [a complete example](tests/websocket.js).

## License
MIT