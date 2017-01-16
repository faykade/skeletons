'use strict'
const ROOT = './'; //everything is configured from the root directory, where gulpfile comes from, NOT here
const VENDOR_SRC_DIR = ROOT + 'client/vendor/src/';
const VENDOR_DIST_DIR = ROOT + 'client/vendor/dist/';
const RESOURCES_SRC_DIR = ROOT + 'client/resources/src/';
const RESOURCES_DIST_DIR = ROOT + 'client/resources/dist/';
const SERVER_ROOT_DIR = ROOT + 'server/';
const SERVER_NAME = 'server.js';

const config_project = require('./config-project');

const config_build = {
  paths: {
    vendor_src_sass: VENDOR_SRC_DIR + 'styles/',
    vendor_src_js: VENDOR_SRC_DIR + 'scripts/',
    vendor_dist_css: VENDOR_DIST_DIR + 'styles/',
    vendor_dist_js: VENDOR_DIST_DIR + 'scripts/',
    resources_src_sass: RESOURCES_SRC_DIR + 'styles/',
    resources_src_js: RESOURCES_SRC_DIR + 'scripts/',
    resources_dist_css: RESOURCES_DIST_DIR + 'styles/',
    resources_dist_js: RESOURCES_DIST_DIR + 'scripts/',
    resources_views: ROOT + 'client/resources/views/',
    public_files: [],
    server_root: SERVER_ROOT_DIR,
    server_path: SERVER_ROOT_DIR + SERVER_NAME,
    search_paths: [ROOT + 'node_modules/foundation-sites/scss'],
  },

  file_names: {
    server_name: SERVER_NAME,
    current_theme: config_project.project.theme,
    loading_order_files: [
      {
        input: 'load_order_header.txt',
        output: 'header.js',
      },
      {
        input: 'load_order_footer.txt',
        output: 'footer.js',
      },
    ],
  },

  project_build: {
    supported_versions: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3'],
  },

  server: {
    port: config_project.server.port,
    host: config_project.server.host,
  },

};

module.exports = config_build;
