module.exports = function (app) {

    const secretsanta = require('../controllers/secret-santa.controller');

    app.post('/secretsantas', secretsanta.generate);
}