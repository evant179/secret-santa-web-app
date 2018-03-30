const serverless = require('serverless-http');
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('secret santa generator service works!!!!');
});

module.exports.handler = serverless(app);