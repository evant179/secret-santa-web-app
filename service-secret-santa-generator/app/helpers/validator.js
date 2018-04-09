const SortedArraySet = require("collections/sorted-array-set");
const BadRequestError = require("../errors/bad-request-error");
const ValidationError = require("../errors/validation-error");

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