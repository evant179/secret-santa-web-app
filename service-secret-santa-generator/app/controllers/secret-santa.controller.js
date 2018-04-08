const BadRequestError = require("../errors/bad-request-error");
const validator = require("../helpers/validator");
const _ = require("underscore");

exports.generate = function (req, res) {
    try {
        console.log('Enter generate');
        console.log(req.body);
        let attendees = req.body;

        // verify request data
        validator.verifyUniqueAttendees(attendees);

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
            console.log(e);
            let error = { error: e.message, stack: e.stack };
            return res.status(406).send(error);
        }

        console.log('Exit generate');
        console.log(results);
        return res.status(200).send(results);
    }
    catch (e) {
        console.log(e);
        let error = { error: e.message, stack: e.stack };
        if (e instanceof BadRequestError) {
            return res.status(400).send(error);
        } else {
            return res.status(500).send(error)
        }
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
        let message = `Secret santa generation has stopped! Please try again. ` +
            `Reason: [${attendee.name}] has no more names left in their remaining name pool!`;
        throw new Error(message);
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