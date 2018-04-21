const BadRequestError = require("../errors/bad-request-error");
const GenerateError = require("../errors/generate-error");
const ValidationError = require("../errors/validation-error");
const validator = require("../helpers/validator");
const _ = require("underscore");

exports.generate = function (req, res) {
    try {
        console.log('Enter generate');
        console.log(req.body);
        let attendees = req.body;

        validator.verifyAttendeesModel(attendees);
        validator.verifyUniqueAttendees(attendees);
        let results = handleGenerate(attendees);
        validator.verifyResults(attendees, results);

        console.log('Exit generate with results');
        console.log(results);
        return res.status(200).send(results);
    }
    catch (e) {
        console.log(e);
        let error = { error: e.message, stack: e.stack };
        if (e instanceof BadRequestError) {
            return res.status(400).send(error);
        } else if (e instanceof GenerateError) {
            return res.status(406).send(error)
        } else if (e instanceof ValidationError) {
            return res.status(406).send(error)
        } else {
            return res.status(500).send(error)
        }
    }
};

function handleGenerate(attendees) {
    let results = [];
    // initialize array used to keep track of available names for selection
    let availableNames = createAvailableNameList(attendees);

    // sort by most to least amount of historic data and exclusions to lessen chance
    // of generate error
    attendees.sort((a, b) => {
        let unavailableCountA = a.historicSelections.length + a.exclusions.length;
        let unavailableCountB = b.historicSelections.length + b.exclusions.length;
        return unavailableCountB - unavailableCountA;
    });

    attendees.forEach(attendee => {
        let result = {};
        result.name = attendee.name;
        if (isDefinedAndValid(attendee.overriddenSelection)) {
            result.selectedName = attendee.overriddenSelection;
        } else {
            result.selectedName = processSelectedName(attendee, availableNames);
        }
        results.push(result);
    });

    return results;
}

function createAvailableNameList(attendees) {
    let availableNames = [];
    let overriddenNames = [];
    attendees.forEach(attendee => {
        if (isDefinedAndValid(attendee.overriddenSelection)) {
            console.log(`[${attendee.name}] has an OVERRIDDEN selection of [${attendee.overriddenSelection}]`);
            overriddenNames.push(attendee.overriddenSelection);
        }
    });
    attendees.forEach(attendee => {
        if (!contains(overriddenNames, attendee.name)) {
            availableNames.push(attendee.name);
        }
    });
    return availableNames;
}

function processSelectedName(attendee, availableNames) {
    let namePool = availableNames.slice(); // shallow copy
    adjustNamePool(attendee, namePool);

    if (namePool.length < 1) {
        let message = `Secret santa generation has stopped! Please try again. ` +
            `Reason: [${attendee.name}] has no more names left in their remaining name pool!`;
        throw new GenerateError(message);
    }

    // choose selected name from remaining name pool
    let selectedName = _.sample(namePool);
    console.log(`[${attendee.name}] has been selected [${selectedName}]`);

    // remove selected name from overall available name pool
    remove(availableNames, selectedName);
    return selectedName;
}

function adjustNamePool(attendee, namePool) {
    // remove own name from pool
    remove(namePool, attendee.name);
    // TODO - remove historic, overridden, excluded names from namePool
    attendee.historicSelections.forEach(historicData => {
        remove(namePool, historicData.selectedName);
    });
    attendee.exclusions.forEach(exclusionName => {
        remove(namePool, exclusionName);
    });
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

function isDefinedAndValid(value) {
    return value !== undefined && value;
}

function contains(array, obj) {
    return (array.indexOf(obj) != -1);
}