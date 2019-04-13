'use_strict';

// modules =================================================
const express = require('express'),
    bodyParser = require('body-parser'),
    app = express();

// configuration ===========================================
const port = 40001; // set our port

app.use(bodyParser.json()); // parse application/json

// start app ===============================================
app.listen(port);
console.log('Server started on port ' + port + ', environment: ' + process.env.NODE_ENV); 			// shoutout to the user

app.get('/', function (req, res) {
    console.error('Error');
    console.log('Request');

    res.json({
        'message': 'Todo ok por el server 1'
    });
});

// Gracefull stop
process.on('SIGINT', () => {
    console.info('SIGINT signal received.');
    process.exit(1);
});

exports = module.exports = app; 						// expose app
