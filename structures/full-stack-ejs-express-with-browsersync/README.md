# Full Stack Express Template

## What is it?
This is used primarily for a template to kick off projects and create a decent development experience.  Some of the different things that it allows for are:
  * SCSS Builds with multiple themes for a single site
  * Convenient development setup
  * Templating with EJS
  * JS & CSS minification
    * Allows you to define the order your JS files and CSS files in the minification process
    * Allows multiple load order files (for example, if you need header.js, and footer.js files as well)
    * Allows for non-minified experience for development via a --dev argument to the builds
  * Sound directory structure for small-medium projects

## Technologies Used
  * Node.js with Express for server side
  * EJS templating language
  * Gulp as a build tool
  * Autoprefixer for SCSS files
  * Minification of JS and CSS files
  * Browser-sync and nodemon to keep projects running and building hands-free

## Structure
A basic setup has been included to show how the skeleton of the structure works, but essentially the structure is as follows:
```
- root
    - client                             // client side directory
        - vendor                         // use for vendor libraries (JS & CSS)
            - dist
            - src
        - resources                      // user made resources
            - dist        
            - src
                - scripts
                - styles
                    - global             // all theme sass
                    - themes             // single theme overrides and variables
                        - blue-theme    
            - views                      // ejs files
            - assets                     // images, fonts, etc.
    - configs
    - server
        - server.js                      // server entry point, basic setup
    - gulpfile.js
```

## Configuration
Most of the configuration is limited to the different files in the /configs directory.  The way to make these configuration files work well, is that when they are instantiated, they need to be passed a parameter that defines where you currently are located from the root directory of the project.  The following is an example of how this works.

```
// STRUCTURE
- root
    - server
        - server.js        // *** assume I'm in this file
    - configs
        - config-server.js

// in server.js
const config = require('../configs/config-server')('../');
```
This way, the configuration will know how to pass back path references according to where you are located in the project structure.

The configuration files are pretty well laid out for their purpose, but some changes could be made for the brave user.  The server and client side code is meant to obfuscate the real directory structure once built.  This is all defined in the server side configuration files, and is where the different static file paths are decided for the distributed CSS, JS, and assets directories.

## Building
To understand the building, I would recommend delving into the gulpfile a bit, but many of the essential parameters are housed in the config for builds.  
```
gulp        // builds project, starts server, and starts browser-sync   
gulp help   // shows more specific commands possible  

// Add --dev to any build option to make unminified CSS and JS.     
```
