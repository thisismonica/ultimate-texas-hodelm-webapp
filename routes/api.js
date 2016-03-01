var express = require('express');
var router = express.Router();
var PythonShell = require('python-shell');

router.post('/simulate', function(req, res, next) {

    var times = req.query.times;
    console.log("print times");
    console.log(times);
    console.log("end print");
    if (!times) {
        res.statusCode = 500;
        res.send("No Results Found");
        console.log("finished");
    }
    var options = {
        mode: 'json',
        pythonPath: '/usr/bin/python',
        pythonOptions: ['-u'],
        scriptPath: '../pythons/',
        args: [times]
    };

    var pyshell = new PythonShell('simulate.py', options);

    // sends a message to the Python script via stdin
    console.log(req.body)
    pyshell.send(req.body);

    pyshell.on('message', function (message) {
        // received a message sent from the Python script (a simple "print" statement)
        console.log(message);
        res.send(message);
    });

    // end the input stream and allow the process to exit
    pyshell.end(function (err) {
        if (err) {
            res.statusCode = 500;
            res.send("Error running simulation scripts");
        }
        console.log('finished');
    });


});

module.exports = router;