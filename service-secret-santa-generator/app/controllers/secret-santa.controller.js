exports.generate = function (req, res) {
    console.log('Enter generate');
    console.log(req.body);
    var attendees = req.body;
    var results = [];

    attendees.forEach(attendee => {
        result = {};
        result.name = attendee.name;
        result.selectedName = 'buh';
        results.push(result);
    });

    console.log('Exit generate');
    console.log(results);
    return res.status(200).send(results);
};