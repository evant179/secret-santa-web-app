// const model = require('../models/secret-santa.model');

exports.generate = function (req, res) {
    var testModel = {};
    testModel.name = 'testName';
    // var output = JSON.stringify(testModel);

    return res.status(200).send(testModel);
};