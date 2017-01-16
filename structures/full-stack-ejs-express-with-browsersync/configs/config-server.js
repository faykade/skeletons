const config_project = require('./config-project');

var builder = function(ROOT){

  const VIEWS_DIR = ROOT + 'client/resources/views/';
  const STATIC_SITE_ROOT = ROOT + 'client/resources/dist/';
  const STATIC_LIBS_ROOT = ROOT + 'client/vendor/dist/';
  const STATIC_ASSETS_DIR = ROOT + 'client/resources/assets/';

  const config_server = {
    server: {
      host: 'localhost',
      port: '5000',
    },
    paths: {
      view_path: VIEWS_DIR,
      static_paths: [
        {
          actual: STATIC_SITE_ROOT + 'styles/themes/' + config_project.visual.theme + '/',
          display: '/site',
        },
        {
          actual: STATIC_SITE_ROOT + 'scripts/',
          display: '/site',
        },
        {
          actual: STATIC_LIBS_ROOT + 'styles/',
          display: '/libs',
        },
        {
          actual: STATIC_LIBS_ROOT + 'scripts/',
          display: '/libs',
        },
        {
          actual: STATIC_ASSETS_DIR,
          display: '/assets',
        },
      ],
    },
  };
  return config_server;
}

module.exports = builder;
