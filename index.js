const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.writeHead(200);
  res.end('Hello world');
});

app.listen('8000');

console.log('app listening on port', 8000);

exports = module.exports = app;