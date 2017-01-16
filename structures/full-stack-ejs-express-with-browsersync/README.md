# Full Stack Express Template

## What is it?
This is used primarily for a template to kick off projects and create a decent development experience.  Some of the different things that it allows for are:
  * SCSS Builds with multiple themes for a single site
  * Convenient development setup
  * Templating with EJS
  * JS & CSS minification
  * Sound directory structure for small-medium projects

## Technologies Used
  * Node.js with Express for server side
  * EJS templating language
  * Gulp as a build tool
  * Autoprefixer for SCSS files
  * Minification of JS and CSS files
  * Browser-sync and nodemon to keep projects running and building hands-free

## Structure
Essentially, the structure is as follows
```
- root
    - client                        // client side directory
        - vendor                    // use for vendor libraries (JS & CSS)
            - dist
            - src
        - resources                 // user made resources
            - dist        
            - src
                - scripts
                - styles
                    - global        // all theme sass
                    - blue-theme    // single theme overrides and variables
            - views                 // ejs files
            - assets                // images, fonts, etc.
    - configs
    - server
    - gulpfile.js
```

## Configuration
Most of the configuration is limited to the different files in the /configs directory.  Although this is a directory, the configs are actually set up as if they are in the root directory, just be aware of that.  This was done to keep gulp in the root directory, and most of the the configs were semi dependent on knowing where they were located from the root.  The configuration files are pretty well laid out for their purpose, but some changes could be made for the brave user.

The server and client side code is meant to obfuscate the real directory structure once built.  This is all defined in the server side code, and is where the different static file paths are decided for the distributed CSS, JS, and assets directories.

## Key Commands
```
gulp        // builds project, starts server, and starts browser-sync   
gulp help   // shows more specific commands possible  

// Add --dev to any build option to make unminified CSS and JS.     
```
