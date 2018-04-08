const assert = require('assert');
const mock = require('sinon-express-mock');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

const secretsanta = require('../app/controllers/secret-santa.controller');

describe('secret-santa.controller tests', function () {
  describe('#generate', function () {
    it('generates a secret santa per attendee', function () {
      let req = createRequest();
      let res = mock.mockRes();
      secretsanta.generate(req, res);
      expect(res.status).to.be.calledWith(200);
      // expect(res.status().send).to.be.calledWith({ name: "testName" });
    });
  });
});

function createRequest() {
  let req = {};
  req.body = [
    {
      name: "name1"
    },
    {
      name: "name2"
    }
  ];
  return req;
}