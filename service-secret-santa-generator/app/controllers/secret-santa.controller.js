var _ = require("underscore");

exports.generate = function (req, res) {
    try {
        console.log('Enter generate');
        console.log(req.body);
        let attendees = req.body;

        // initialize map used to keep track of available names for selection
        let availableNames = createAvailableNameList(attendees);

        let results = [];
        try {
            attendees.forEach(attendee => {
                result = {};
                result.name = attendee.name;
                result.selectedName = assignSelectedName(attendee, availableNames);
                results.push(result);
            });
        }
        catch (e) {
            let message = `Unable to generate secret santa results due to: ${e}`;
            console.log(message);
            return res.status(406).send({ error: message })
        }

        console.log('Exit generate');
        console.log(results);
        return res.status(200).send(results);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send({ error: e.message, stack: e.stack })
    }
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

    if (namePool.length < 1) {
        throw `[${attendee.name}] has no more names left in their remaining name pool!`;
    }

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