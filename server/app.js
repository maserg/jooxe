/* 
 * Main server app - load apps from the apps folder and mount them inside a path prefix
 */


const config = require('./config'),
  express = require("./express"),     // https://github.com/expressjs/express
  chalk = require('chalk'),           // https://github.com/chalk/chalk/
  path = require('path'),
  globber = require('./helpers/glob_paths');

module.exports.init = function init(callback) {
  const mainapp = express.init();
  
  const apps = globber('apps/**/jooxe_app.js');
  
  console.log('apps == ', apps);
 
  apps.forEach(function(filepath){
    var subapp = require(path.join(process.cwd(), filepath));
    subapp.init(function(app,config){
      mainapp.use(config.mount_point,app);
    });
  
  });

  if (callback) callback(mainapp, config);
};

module.exports.start = function start(callback) {
  const _this = this;

  _this.init(function (app, config) {

    // Start the app by listening on <port> at <host>
    app.listen(config.port, config.host, function () {
      // Create server URL
      var server = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.host + ':' + config.port;
      // Logging initialization
      console.log('--');
      console.log(chalk.green(config.app.title));
      console.log();
      console.log(chalk.green('Environment:     ' + process.env.NODE_ENV));
      console.log(chalk.green('Server:          ' + server)); 
      console.log(chalk.green('App version:     ' + config.jooxe.version));
      if (config.jooxe['jooxe-version'])
        console.log(chalk.green('Jooxe version: ' + config.jooxe['jooxe-version']));
      console.log('--');

      if (callback) callback(app, db, config);
    });

  });

};

