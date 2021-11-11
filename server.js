// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

app.get('/api/', (req, res, next) => {
  var date = new Date();
  req.unix = date.getTime();
  req.time_response = date.toGMTString();

  next();
}, (req, res) => {
  res.json({
      unix: req.unix,
      utc: req.time_response
  });
});

app.get('/api/:date', (req, res, next) => {
    var { date: date_string } = req.params;
    var time_response = "";
    var date;
    try {

      if (/^\d+$/.test(date_string)) {
        date = new Date(0);
        date.setUTCSeconds(date_string / 1000);
      } else
        date = new Date(date_string);

      if (!isValidDate(date))
        throw Error("Invalid date");

      req.unix = date.getTime();
      req.time_response = date.toGMTString();

      next();

    } catch(error) {
      res.status(error.status || 500).send(
        {
        error: error.message
        }
      );
    }
  }, (req, res) => {
    res.json({
      unix: req.unix,
      utc: req.time_response
    });
  }
);

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}



