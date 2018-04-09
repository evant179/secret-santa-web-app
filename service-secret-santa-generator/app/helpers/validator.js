const SortedArraySet = require("collections/sorted-array-set");
const BadRequestError = require("../errors/bad-request-error");
const ValidationError = require("../errors/validation-error");

exports.verifyAttendeesModel = function (attendees) {
    if (!isDefinedAndValidNonEmptyArray(attendees)) {
        throw new BadRequestError('attendees is not a non-empty array');
    }

    attendees.forEach(attendee => {
        if (!isDefinedAndValid(attendee.name)) {
            throw new BadRequestError('name is not valid');
        }
        if (!isDefinedAndValidArray(attendee.historicSelections)) {
            throw new BadRequestError('historicSelections is not an array');
        }
        if (!isDefinedAndValidArray(attendee.exclusions)) {
            throw new BadRequestError('exclusions is not an array');
        }
    });

    return true;
}

exports.verifyUniqueAttendees = function (attendees) {
    // no duplicate attendees!
    let set = new SortedArraySet();
    attendees.forEach((attendee) => {
        let name = attendee.name;
        if (!set.add(name)) {
            throw new BadRequestError(`Duplicate attendee name [${name}]`);
        }
    });
    return true;
}

exports.verifyResults = function (attendees, results) {
    // can assume every attendee name is unique.

    // verify each attendee has corresponding results
    let attendeeSet = new SortedArraySet();
    let resultNameSet = new SortedArraySet();
    let resultSelectedNameSet = new SortedArraySet();
    attendees.forEach((attendee) => attendeeSet.add(attendee.name));
    results.forEach((result) => {
        resultNameSet.add(result.name)
        resultSelectedNameSet.add(result.selectedName)
    });

    if (!attendeeSet.equals(resultNameSet)) {
        throw new ValidationError('Attendees and generated result NAMES do not sync!');
    }

    if (!attendeeSet.equals(resultSelectedNameSet)) {
        throw new ValidationError('Attendees and generated result SELECTED NAMES do not sync!');
    }

    console.log('Results verified!');
    return true;
}

function isDefinedAndValid(value) {
    return value !== undefined && value;
}

function isDefinedAndValidArray(array) {
    return isDefinedAndValid(array) && Array.isArray(array);
}

function isDefinedAndValidNonEmptyArray(array) {
    return isDefinedAndValidArray(array) && array.length;
}