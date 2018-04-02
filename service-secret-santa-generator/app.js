const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function (req, res) {
  res.send('secret santa generator service works!!!!');
});

require('./app/routes/secret-santa.routes')(app);

module.exports.handler = serverless(app);