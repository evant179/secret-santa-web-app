module.exports = function (app) {

    const secretsanta = require('../controllers/secret-santa.controller');

    app.get('/secretsantas', secretsanta.generate);
}