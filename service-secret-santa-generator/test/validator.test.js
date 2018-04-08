const validator = require('../app/helpers/validator');
const BadRequestError = require("../app/errors/bad-request-error");
const ValidationError = require("../app/errors/validation-error");
const SortedArraySet = require("collections/sorted-array-set");

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;

describe('validator tests', function () {
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
    },
    {
      name: "name2",
    }
  ];
}

function createNonUniqueAttendees() {
  return [
    {
      name: "name1",
    },
    {
      name: "name1",
    }
  ];
}
