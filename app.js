require('babel/register');

var init = require('./config/init')(),
    config = require('./config/config'),
    chalk = require('chalk');

var app = require('./config/express')();

// require('./config/password')();

var server = app.listen(config.port);
var socket = require('./config/socket')(server);

exports = module.exports = app;

console.log("\r\n");
console.log(chalk.green(config.app.title + ' running ...\r\n'));
console.log(chalk.green('Environment:') + '\t' + process.env.NODE_ENV);
console.log(chalk.green('Port:') + '\t\t' + config.port);
console.log(chalk.green('Database:') + '\t' + config.db.connection.host);
console.log("\r\n");

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handlers

// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });


// module.exports = app;
