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
var glob = require('glob');

var config = require('./configs/config-build');

/*==============================================================================
COMMON RUN TASKS
==============================================================================*/
gulp.task('vendor', ['vendorJS', 'vendorSASS']);
gulp.task('resources', ['resourcesJS', 'resourcesSASS']);
gulp.task('all-builds', ['vendor', 'resources']);
gulp.task('default', ['all-builds', 'browser-sync'], function(){
  startWatch()
});
gulp.task('help', function(){
  console.log("===============================================================");
  console.log("Use the following common gulp commands to build the site project");
  console.log("along with other potential time saving devices");
  console.log("---------------------");
  console.log("   'gulp'               builds project, starts the server, and syncs browser");
  console.log("   'gulp vendor'        builds all vendor libraries");
  console.log("   'gulp resources'     builds all site resource code");
  console.log("   'gulp all-builds'    builds all code");
  console.log("---------------------");
  console.log("Options");
  console.log("---------------------");
  console.log("Add '--dev' to any of the above commands to build in development");
  console.log("mode, which will show unminified output files");
  console.log("===============================================================");
});
/*==============================================================================
HELPER TASKS
==============================================================================*/
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
      if(!started){
        started = true;
        cb();
      }
      else{
        setTimeout(function(){browserSync.reload()}, 1500);
      }
    })
});
/*==============================================================================
HELPER FUNCTIONS
==============================================================================*/
/*------------------------------------------------------------------------------
Watches important directories for changes, and applies specified task to compile
on changes.  ** is given because it not only watches subdirectories, but also files
in its own.  Need to be careful about the patterns matching on to watch for changes
to limit the builds.
------------------------------------------------------------------------------*/
var startWatch = function(){
  gulp.watch(config.paths.vendor_src_js + '**', ['vendorJS']);
  gulp.watch(config.paths.vendor_src_sass + '**', ['vendorSASS']);
  gulp.watch(config.paths.resources_src_js + '**', ['resourcesJS']);
  gulp.watch(config.paths.resources_src_sass + '**', ['resourcesSASS']);
  gulp.watch(config.paths.resources_views + '**').on("change", browserSync.reload);
};

/*------------------------------------------------------------------------------
Gets the build options for SASS and JS compilation
------------------------------------------------------------------------------*/
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

/*------------------------------------------------------------------------------
Checks if path exists, then performs callback.  This uses glob because it can
test both for paths like /test/test.js, but also /test/*.js, which would find
any js files in a directory.
------------------------------------------------------------------------------*/
var checkPathExistence = function(path, callback){
  var pathExists = false;
  glob(path, function(err,files){
    if(err | !files){
      pathExists = false;
    }
    else if(files.length > 0){
      pathExists = true;
    }
    callback(pathExists);
  });
};

/*------------------------------------------------------------------------------
Checks that the loader file exists before trying to read from it.  The config has
objects associated with a loader file, and the output filename associated with it.
------------------------------------------------------------------------------*/
var checkLoaderFile = function(loaderObject, src, dest){
  var loaderFile = src + loaderObject.input;
  checkPathExistence(loaderFile, function(pathExists){
    if(!pathExists){
      console.warn("-------------------");
      console.warn("Loader file doesn't exist for JS files, skipping");
      console.warn("\tLoader File: " + loaderFile);
      console.warn("-------------------");
    }
    else{
      readLoaderFile(loaderFile, loaderObject, src, dest);
    }
  });
};

/*------------------------------------------------------------------------------
Reads a file line by line, and inserts them into an array to concatenate the files
in the correct order to make the JS into one file, while also maintaining the
proper order in case one file depends on another.
------------------------------------------------------------------------------*/
var readLoaderFile = function(loaderFile, loaderObject, src, dest){
  var orderedJS = [];
  var error = false;
  const reader = readline.createInterface({
    input: fs.createReadStream(loaderFile)
  });
  reader.on('line', function(line){
    var currentJS = src + line;
    checkPathExistence(currentJS, function(exists){
      if(exists){
        orderedJS.push(currentJS);
      }
      else{
        console.error("-------------------");
        console.error("File to be loaded doesn't exist");
        console.error("\tLoader File: " + loaderFile);
        console.error("\tFile: " + currentJS);
        console.error("-------------------");
        error = true;
        reader.close();
      }
    });
  });
  reader.on('close',function(){
    if(error){
      console.error("***********************Skipping build***********************");
    }
    else{
      var options = getBuildOptions();
      return gulp.src(orderedJS)
        .pipe(concat(loaderObject.output))
        .pipe(gulpif(options.isDevelopment, beautify(), uglify()))
        .pipe(gulp.dest(dest))
        .pipe(browserSync.stream())
    }
  });
};

/*------------------------------------------------------------------------------
For all the different loader files in the config, read them, then compile each
file listed into one into a single file.  This function starts the process, by
calling a function to check every loader file that is in the config.
------------------------------------------------------------------------------*/
var compileJS = function(src, dest){
  config.file_names.loading_order_files.map(function(loaderObject){
    checkLoaderFile(loaderObject, src, dest);
  });
};

/*------------------------------------------------------------------------------
builds the sass for the project in the given directory.
------------------------------------------------------------------------------*/
var compileSASS = function(src, dest){
  var options = getBuildOptions();
  return gulp.src(src + "**/*.scss")
    .pipe(sass(options.sassOptions).on('error', sass.logError))
    .pipe(autoprefixer(options.prefixer))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.stream())
};
