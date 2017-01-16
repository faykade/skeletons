var express = require('express');
var app = express();
var path = require('path');
var config = require('../configs/config-server')('../');

const PORT = process.env.PORT || 5000;
const SERVER = app.listen(PORT);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, config.paths.view_path));

//setup the static path directories and change the path clients will use to access them
for(var i = 0; i < config.paths.static_paths.length; i++){
  var currentDirectory = config.paths.static_paths[i];
  app.use(currentDirectory.display, express.static(path.join(__dirname, currentDirectory.actual)));
}

app.get('/', function (req, res) {
  res.render('index');
});
