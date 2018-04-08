const SortedArraySet = require("collections/sorted-array-set");
const ValidationError = require("../errors/validation-error");

exports.verifyUniqueAttendees = function (attendees) {
    // no duplicate attendees!
    let set = new SortedArraySet();
    attendees.forEach((attendee) => {
        let name = attendee.name;
        if (!set.add(name)) {
            throw new ValidationError(`Duplicate attendee name [${name}]`);
        }
    });
    return true;
}

exports.verifyResults = function (attendees, results) {
    // verify each attendee has corresponding results
}