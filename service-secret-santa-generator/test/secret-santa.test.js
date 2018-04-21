const assert = require('assert');
const mock = require('sinon-express-mock');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

const secretsanta = require('../app/controllers/secret-santa.controller');

describe('secret-santa.controller tests', function () {
  describe('#generate', function () {
    it('generates a selected name per attendee', function () {
      let req = createRequestSimple();
      let res = mock.mockRes();
      secretsanta.generate(req, res);
      expect(res.status).to.be.calledWith(200);
      expect(res.status().send).to.be.calledWith(createExpectedResponse1());
    });

    it('generates a selected name per attendee with historic data', function () {
      let req = createRequestWithHistoricData1();
      let res = mock.mockRes();
      secretsanta.generate(req, res);
      expect(res.status).to.be.calledWith(200);
      expect(res.status().send).to.be.calledWith(createExpectedResponse2());
    });

    it('generates a selected name per attendee with historic data; relies on sort', function () {
      let req = createRequestWithHistoricData2();
      let res = mock.mockRes();
      secretsanta.generate(req, res);
      expect(res.status).to.be.calledWith(200);
      // results are inconsistent due to random nature
    });

    it('errors for a single attendee', function () {
      let req = createRequestWithSingleAttendee();
      let res = mock.mockRes();
      secretsanta.generate(req, res);
      expect(res.status).to.be.calledWith(406);
    });

    it('errors for a attendee due to no name pool resulting from historic data', function () {
      let req = createRequestWithHistoricData3();
      let res = mock.mockRes();
      secretsanta.generate(req, res);
      expect(res.status).to.be.calledWith(406);
    });
  });
});

function createRequestSimple() {
  let req = {};
  req.body = [
    {
      name: "name1",
      historicSelections: [],
      exclusions: []
    },
    {
      name: "name2",
      historicSelections: [],
      exclusions: []
    }
  ];
  return req;
}

function createRequestWithHistoricData1() {
  let req = {};
  req.body = [
    {
      name: "name1",
      historicSelections: [
        {
          year: 2010,
          selectedName: "name2"
        }
      ],
      exclusions: []
    },
    {
      name: "name2",
      historicSelections: [
        {
          year: 2010,
          selectedName: "name3"
        }
      ],
      exclusions: []
    },
    {
      name: "name3",
      historicSelections: [
        {
          year: 2010,
          selectedName: "name1"
        }
      ],
      exclusions: []
    }
  ];
  return req;
}

function createRequestWithHistoricData2() {
  let req = {};
  req.body = [
    {
      name: "name1",
      historicSelections: [],
      exclusions: []
    },
    {
      name: "name2",
      historicSelections: [],
      exclusions: []
    },
    {
      name: "name3",
      historicSelections: [
        {
          year: 2010,
          selectedName: "name1"
        }
      ],
      exclusions: []
    }
  ];
  return req;
}

function createRequestWithHistoricData3() {
  let req = {};
  req.body = [
    {
      name: "name1",
      historicSelections: [
        {
          year: 2010,
          selectedName: "name2"
        }
      ],
      exclusions: []
    },
    {
      name: "name2",
      historicSelections: [],
      exclusions: []
    }
  ];
  return req;
}

function createRequestWithSingleAttendee() {
  let req = {};
  req.body = [
    {
      name: "name1",
      historicSelections: [],
      exclusions: []
    }
  ];
  return req;
}

function createExpectedResponse1() {
  return [
    {
      name: "name1",
      selectedName: "name2"
    },
    {
      name: "name2",
      selectedName: "name1"
    }
  ];
}

function createExpectedResponse2() {
  return [
    {
      name: "name1",
      selectedName: "name3"
    },
    {
      name: "name2",
      selectedName: "name1"
    },
    {
      name: "name3",
      selectedName: "name2"
    }
  ];
}