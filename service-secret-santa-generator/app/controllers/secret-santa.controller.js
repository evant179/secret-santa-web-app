var _ = require("underscore");

exports.generate = function (req, res) {
    console.log('Enter generate');
    console.log(req.body);
    let attendees = req.body;

    // initialize map used to keep track of available names for selection
    let availableNames = createAvailableNameList(attendees);

    let results = [];
    attendees.forEach(attendee => {
        result = {};
        result.name = attendee.name;
        result.selectedName = assignSelectedName(attendee, availableNames);
        results.push(result);
    });

    console.log('Exit generate');
    console.log(results);
    return res.status(200).send(results);
};

function createAvailableNameList(attendees) {
    let availableNames = [];
    attendees.forEach(attendee => {
        availableNames.push(attendee.name);
    });
    return availableNames;
}

function assignSelectedName(attendee, availableNames) {
    let namePool = availableNames.slice(); // shallow copy

    // TODO - remove historic, overridden, excluded names from namePool

    // remove own name from pool
    remove(namePool, attendee.name);

    // choose selected name from remaining name pool
    let selectedName = _.sample(namePool);
    console.log(`[${attendee.name}] has been selected [${selectedName}]`);

    // remove selected name from overall available name pool
    remove(availableNames, selectedName);
    return selectedName;
}

/**
 * Remove one instance of indicated element from array.
 * Array is mutated.
 * 
 * If element does not exist, array is not mutated.
 */
function remove(array, element) {
    let index = array.indexOf(element);
    if (index !== -1) {
        array.splice(index, 1);
    }
}