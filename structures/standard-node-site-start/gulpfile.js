'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var argv = require('yargs').argv;
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var beautify = require('gulp-beautify');
var fs = require('fs');
var path = require('path');
var merge = require('merge-stream');
var gulpif = require('gulp-if');
var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');

const CLIENT_ROOT = 'client/';
const VIEWS_DIR = 'views/';
const PUBLIC_FILES = ['client/dist', VIEWS_DIR];
const SERVER_NAME = 'server.js';
const SERVER_ROOT = 'server/';
const SCSS_DIR = CLIENT_ROOT + 'styles/**/*.scss';
const JS_DIR = CLIENT_ROOT + 'scripts/';
const JS_SUB_DIRS = ['global/', 'sites/'];
const DEV_DIR = CLIENT_ROOT + 'dist-dev/';
const PROD_DIR = CLIENT_ROOT + 'dist/';
const INCLUDE_PATHS = ['node_modules/foundation-sites/scss'];
const PREFIXER_VERSIONS = ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3'];

var getOptions = function(){
  // expanded, compressed
  var dest;
  var style;
  var devStatus;

  if(argv.dev){
    dest = DEV_DIR;
    style = 'expanded';
    devStatus = true;
  }
  else{
    dest = PROD_DIR;
    style = 'compressed';
    devStatus = false;
  }
  var options = {
    isDevelopment: devStatus,
    destination: dest,
    prefixer: {
      browsers: PREFIXER_VERSIONS,
    },
    sassOptions: {
      outputStyle: style,
      includePaths: INCLUDE_PATHS,
    },
  };

  return options;
}

var getFolders = function(dir){
  return fs.readdirSync(dir)
    .filter(function(file){
      return fs.statSync(path.join(dir,file)).isDirectory();
    });
}

gulp.task


gulp.task('help',function(){
});

gulp.task('browser-sync', ['nodemon'], function(){
  browserSync.init({
    proxy: 'localhost:3000',
    files: [PUBLIC_FILES],
  });
});

gulp.task('nodemon', function(cb){
  var stream = nodemon({
    script: SERVER_NAME,
    watch: [SERVER_NAME, SERVER_ROOT],
  })
    .on('start', function(){
      console.log('SERVER STARTING');
      cb();
    })
    .on('restart', function(){
      console.log('SERVER RESTARTING');
    })
    .on('crash', function(){
      console.log('SERVER CRASH');
      stream.emit('restart',10);
    })
});


gulp.task('default', ['styles', 'scripts', 'browser-sync'], function(){
  gulp.watch(SCSS_DIR, ['styles']);
  gulp.watch(JS_DIR + '**/*.js',['scripts']);
  gulp.watch(VIEWS_DIR + '*').on("change", browserSync.reload);
});

gulp.task('reload',function(){
  browserSync.reload();
});

gulp.task('styles',function(){
  var options = getOptions();

  return gulp.src(SCSS_DIR)
    //.pipe(sourcemaps.init())
    .pipe(sass(options.sassOptions).on('error', sass.logError))
    //.pipe(sourcemaps.write())
    .pipe(autoprefixer(options.prefixer))
    .pipe(gulp.dest(options.destination))
    .pipe(browserSync.stream())
});

gulp.task('scripts',function(){
  var options = getOptions();
  for(var i = 0; i < JS_SUB_DIRS.length; i++){
    var currentDirectory = JS_DIR + JS_SUB_DIRS[i];
    var folders = getFolders(currentDirectory);

    var tasks = folders.map(function(folder){
      return gulp.src(currentDirectory + folder + '/**/*.js')
        .pipe(concat('script.js'))
        .pipe(gulpif(options.isDevelopment, beautify(), uglify()))
        .pipe(gulp.dest(options.destination + JS_SUB_DIRS[i] + folder))
    });

    var root = gulp.src(currentDirectory + '/*.js')
        .pipe(concat('script.js'))
        .pipe(gulpif(options.isDevelopment, beautify(), uglify()))
        .pipe(gulp.dest(options.destination + JS_SUB_DIRS[i]))

   merge(tasks, root);
  }
  browserSync.reload();
});
