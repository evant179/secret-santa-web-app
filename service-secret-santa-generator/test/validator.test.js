const validator = require('../app/helpers/validator');
const BadRequestError = require("../app/errors/bad-request-error");
const ValidationError = require("../app/errors/validation-error");
const SortedArraySet = require("collections/sorted-array-set");

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;

describe('validator tests', function () {
  describe('#verifyAttendeesModel', function () {
    it('returns true on valid model', function () {
      let attendees = createUniqueAttendees();
      assert.isTrue(validator.verifyAttendeesModel(attendees));
    });

    it('throws error on expected attendees array (bad value)', function () {
      let attendees = 1;
      expect(validator.verifyAttendeesModel.bind(validator, attendees)).to.throw(BadRequestError);
    });

    it('throws error on expected attendees array (undefined)', function () {
      let attendees;
      expect(validator.verifyAttendeesModel.bind(validator, attendees)).to.throw(BadRequestError);
    });

    it('throws error on expected non-empty attendees array', function () {
      let attendees = [];
      expect(validator.verifyAttendeesModel.bind(validator, attendees)).to.throw(BadRequestError);
    });

    it('throws error on expected valid name field (empty string)', function () {
      let attendees = [{ name: "", historicSelections: [], exclusions: [] }];
      expect(validator.verifyAttendeesModel.bind(validator, attendees)).to.throw(BadRequestError);
    });

    it('throws error on expected valid name field (undefined)', function () {
      let attendees = [{ historicSelections: [], exclusions: [] }];
      expect(validator.verifyAttendeesModel.bind(validator, attendees)).to.throw(BadRequestError);
    });

    it('throws error on expected historicSelections array', function () {
      let attendees = [{ name: "name1", historicSelections: "badvalue", exclusions: [] }];
      expect(validator.verifyAttendeesModel.bind(validator, attendees)).to.throw(BadRequestError);
    });

    it('throws error on expected exclusions array', function () {
      let attendees = [{ name: "name1", historicSelections: [], exclusions: "badvalue" }];
      expect(validator.verifyAttendeesModel.bind(validator, attendees)).to.throw(BadRequestError);
    });
  });

  describe('#verifyUniqueAttendees', function () {
    it('returns true on unique attendees', function () {
      let attendees = createUniqueAttendees();
      assert.isTrue(validator.verifyUniqueAttendees(attendees));
    });

    it('throws error on duplicate attendees', function () {
      let attendees = createNonUniqueAttendees();
      expect(validator.verifyUniqueAttendees.bind(validator, attendees)).to.throw(BadRequestError);
    });
  });

  describe('#verifyResults', function () {
    it('returns true on verified results', function () {
      let attendees = createUniqueAttendees();
      let results = [{ name: "name2", selectedName: "name1" }, { name: "name1", selectedName: "name2" }];
      assert.isTrue(validator.verifyResults(attendees, results));
    });

    it('throws error on NAMES out of sync', function () {
      let attendees = createUniqueAttendees();
      let results = [{ name: "name1", selectedName: "name2" }];
      expect(validator.verifyResults.bind(validator, attendees, results)).to.throw(ValidationError());
    });

    it('throws error on SELECTED NAMES out of sync', function () {
      let attendees = createUniqueAttendees();
      let results = [{ name: "name2", selectedName: "name1" }, { name: "name1", selectedName: "name1" }];
      expect(validator.verifyResults.bind(validator, attendees, results)).to.throw(ValidationError());
    });
  });
});

describe('SortedArraySet tests', function () {
  it('does nothing with duplicate values', function () {
    let set = new SortedArraySet();
    assert.isTrue(set.add('name1'));
    assert.isFalse(set.add('name1'));
    assert.equal(set.length, 1);
  });

  it('orders alphabetically', function () {
    let set = new SortedArraySet();
    set.add('name3');
    set.add('name1');
    set.add('name2');
    let array = set.toArray();
    assert.equal(array[0], 'name1');
  });

  it('performs equality check (true)', function () {
    let set1 = new SortedArraySet();
    set1.add('name1');
    set1.add('name2');
    let set2 = new SortedArraySet();
    set2.add('name2');
    set2.add('name1');
    assert.isTrue(set1.equals(set2));
  });

  it('performs equality check (false)', function () {
    let set1 = new SortedArraySet();
    set1.add('name1');
    set1.add('name2');
    let set2 = new SortedArraySet();
    set2.add('name3');
    set2.add('name1');
    assert.isFalse(set1.equals(set2));
  });
});

function createUniqueAttendees() {
  return [
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
}

function createNonUniqueAttendees() {
  return [
    {
      name: "name1",
      historicSelections: [],
      exclusions: []
    },
    {
      name: "name1",
      historicSelections: [],
      exclusions: []
    }
  ];
}