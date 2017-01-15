var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var argv = require('yargs').argv;
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var beautify = require('gulp-beautify');
var fs = require('fs');
var gulpif = require('gulp-if');
var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');
var readline = require('readline');
var config = require('./configs/config-build');

var nodemon_instance = undefined;
/*==============================================================================
COMMON RUN TASKS
==============================================================================*/
gulp.task('vendor', ['vendorJS', 'vendorSASS']);
gulp.task('resources', ['resourcesJS', 'resourcesSASS']);
gulp.task('all-builds', ['vendor', 'resources']);
gulp.task('default', ['all-builds', 'browser-sync'], function(){
  startWatch()
});

/*==============================================================================
HELPER TASKS
==============================================================================*/
gulp.task('help', function(){

});

gulp.task('vendorJS', function(){
  compileJS(config.paths.vendor_src_js, config.paths.vendor_dist_js)
});

gulp.task('vendorSASS', function(){
  compileSASS(config.paths.vendor_src_sass, config.paths.vendor_dist_css)
});

gulp.task('resourcesJS', function(){
  compileJS(config.paths.resources_src_js, config.paths.resources_dist_js);
});

gulp.task('resourcesSASS', function(){
  compileSASS(config.paths.resources_src_sass, config.paths.resources_dist_css);
});

gulp.task('browser-sync', ['nodemon'], function(){
  browserSync.init({
    proxy: config.server.host + ':' + config.server.port,
    files: config.paths.public_files,
  });
  browserSync.reload();
});

gulp.task('nodemon', function(cb){
  var started = false;
  var stream = nodemon({
    script: config.paths.server_path,
    watch: config.paths.server_root,
  })
    .on('start', function(){
      console.log("UNSURE STARTED");
      if(!started){
        console.log('NOT STARTED');
        started = true;
        cb();
      }
      else{
        console.log("WAS STARTED");
        setTimeout(function(){browserSync.reload()}, 1500);
      }
    })
});
/*==============================================================================
HELPER FUNCTIONS
==============================================================================*/
var getBuildOptions = function(){
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
    prefixer: {
      browsers: config.project_build.supported_versions,
    },
    sassOptions: {
      outputStyle: style,
      includePaths: config.paths.search_paths,
    },
  };

  return options;
};

var startWatch = function(){
  gulp.watch(config.paths.vendor_src_js + '**', ['vendorJS']);
  gulp.watch(config.paths.vendor_src_sass + '**', ['vendorSASS']);
  gulp.watch(config.paths.resources_src_js + '**', ['resourcesJS']);
  gulp.watch(config.paths.resources_src_sass + '**', ['resourcesSASS']);
  gulp.watch(config.paths.resources_views + '**').on("change", browserSync.reload);
};

var pathExists = function(path){
  return fs.existsSync(path);
};

var compileJS = function(src, dest){
  var options = getBuildOptions();
  var finishedCount = 0;
  config.file_names.loading_order_files.map(function(currentFile){
    var loaderFile = src + currentFile.input;
    var error = false;
    if(!pathExists(loaderFile)){
      console.warn("-------------------");
      console.warn("Loader file doesn't exist for JS files, skipping");
      console.warn("\tLoader File: " + loaderFile);
      console.warn("-------------------");
    }
    else {
      var orderedJS = [];
      const reader = readline.createInterface({
        input: fs.createReadStream(loaderFile)
      });
      reader.on('line', function(line){
        var currentJS = src + line;
        if(pathExists(currentJS)){
          orderedJS.push(currentJS);
        }
        else{
          console.error("-------------------");
          console.error("File to be loaded doesn't exist, skipping build");
          console.error("\tLoader File: " + loaderFile);
          console.error("\tFile: " + currentJS);
          console.error("-------------------");
          error = true;
          reader.close();
        }
      });
      reader.on('close', function(event){
        if(!error){
          return gulp.src(orderedJS)
            .pipe(concat(currentFile.output))
            .pipe(gulpif(options.isDevelopment, beautify(), uglify()))
            .pipe(gulp.dest(dest))
            .pipe(browserSync.stream())
        }
      });
    }
  });
};

var compileSASS = function(src, dest){
  var options = getBuildOptions();
  console.log(src + "**/*.scss");
  return gulp.src(src + "**/*.scss")
    .pipe(sass(options.sassOptions).on('error', sass.logError))
    .pipe(autoprefixer(options.prefixer))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.stream())
};
