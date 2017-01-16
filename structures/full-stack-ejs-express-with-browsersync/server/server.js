var express = require('express');
var app = express();
var path = require('path');


const PORT = process.env.PORT || 5000;
const SERVER = app.listen(PORT);

const STATIC_SITE_DIR = '../client/resources/dist/';
const STATIC_LIBS_DIR = '../client/vendor/dist/';
const VIEWS_DIR = '../client/resources/views/';
const STATIC_SITE_STYLES_DIR = '../client/resources/dist/styles/blue-theme/';
const STATIC_SITE_SCRIPTS_DIR = '../client/resources/dist/scripts/';
const STATIC_LIBS_STYLES_DIR = '../client/vendor/dist/styles/';
const STATIC_LIBS_SCRIPTS_DIR = '../client/vendor/dist/scripts/';
const STATIC_ASSETS_DIR = '../client/resources/assets/';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, VIEWS_DIR));
app.use('/site', express.static(path.join(__dirname, STATIC_SITE_STYLES_DIR)));
app.use('/site', express.static(path.join(__dirname, STATIC_SITE_SCRIPTS_DIR)));
app.use('/libs', express.static(path.join(__dirname, STATIC_LIBS_STYLES_DIR)));
app.use('/libs', express.static(path.join(__dirname, STATIC_LIBS_SCRIPTS_DIR)));
app.use('/assets', express.static(path.join(__dirname, STATIC_ASSETS_DIR)));

app.get('/', function (req, res) {
  res.render('index');
  //res.send("<html><head><title>Hello</title></head><body>Hello World</body></html>");
});
