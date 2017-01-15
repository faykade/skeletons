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

var config = require('./config');
/*
gulp.task('styles',function(){
  var options = getOptions();


});
*/




var getOptions = function(){
  // expanded, compressed
  var dest;
  var style;
  var devStatus;

  if(argv.dev){
    style = 'expanded';
    devStatus = true;
  }
  else{
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



var compileJS = function(src, dest){
  console.log("compileJS");
};

var compileSASS = function(src, dest){
  var options = getOptions();
  return gulp.src(src + "**/*.scss")
    .pipe(sass(options.sassOptions).on('error', sass.logError))
    .pipe(autoprefixer(options.prefixer))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.stream())
};

gulp.task('vendorJS', function(){
  compileJS(config.directories.vendor_src_js, config.directories.vendor_dist_js)
});

gulp.task('vendorSASS', function(){
  compileSASS(config.directories.vendor_src_sass, config.directories.vendor_dist_css)
});

gulp.task('resourcesJS', function(){
  compileJS(config.directories.resources_src_js, config.directories.resources_dist_js);
});

gulp.task('resourcesSASS', function(){
  compileSASS(config.directories.resources_src_sass, config.directories.resources_dist_css);
});

gulp.task('vendor', ['vendorJS', 'vendorSASS']);
gulp.task('resources', ['resourcesJS', 'resourcesSASS']);
gulp.task('all', ['vendor', 'resources']);

gulp.task('hello',function(){
  console.log("hello");
});

gulp.task('world',function(){
  console.log("world");
});
