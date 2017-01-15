'use strict'
const ROOT = './';
const VENDOR_SRC_DIR = ROOT + 'client/vendor/src';
const VENDOR_DIST_DIR = ROOT + 'client/vendor/dist';
const RESOURCES_SRC_DIR = ROOT + 'client/resources/src';
const RESOURCES_DIST_DIR = ROOT + 'client/resources/dist';

const config = {
  server: {

  },

  client: {

  },

  directories: {
    vendor_src_sass: VENDOR_SRC_DIR + 'styles/scss/',
    vendor_src_css: VENDOR_SRC_DIR + 'styles/css/',
    vendor_src_js: VENDOR_SRC_DIR + 'scripts/',
    vendor_dist_css: VENDOR_DIST_DIR + 'styles/',
    vendor_dist_js: VENDOR_DIST_DIR + 'scripts/',
    resources_src_sass: RESOURCES_SRC_DIR + 'styles/scss/',
    resources_src_js: RESOURCES_SRC_DIR + 'scripts/',
    resources_dist_css: RESOURCES_DIST_DIR + 'styles/',
    resources_dist_js: RESOURCES_DIST_DIR + 'scripts/',
  },

  gulp: {
    loading_order_file: 'load_order.txt',
  },

  project: {

  },
};

module.exports = config;
