var express = require('express');
var app = express();
var path = require('path');


const PORT = process.env.PORT || 5000;
const SERVER = app.listen(PORT);
/*
const STATIC_SITE_DIR = 'client/dist/sites/site2/';
const STATIC_LIBS_DIR = 'client/dist/global/'


app.set('view engine', 'ejs');
app.use('/site', express.static(path.join(__dirname, STATIC_SITE_DIR)));
app.use('/libs', express.static(path.join(__dirname, STATIC_LIBS_DIR)));
app.use('/libs', express.static(path.join(__dirname, STATIC_LIBS_DIR + "/libs/")));
*/
app.get('/', function (req, res) {
  //res.render('index');
  res.send("<html><head><title>Hello</title></head><body>Hello World</body></html>");
});
