const serverless = require('serverless-http');
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('secret santa generator service works!');
});

app.listen(8081, function () {
  console.log('Example app listening on port 8081!');
});

module.exports.handler = serverless(app);