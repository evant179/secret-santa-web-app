// const model = require('../models/secret-santa.model');

exports.generate = function (req, res) {
    console.log(req.body);

    var testModel = {};
    testModel.name = 'testName';
    return res.status(200).send(testModel);
};