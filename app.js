require('babel/register');

var init = require('./config/init')(),
    config = require('./config/config'),
    mongoose = require('mongoose'),
    chalk = require('chalk');

var db = mongoose.connect(config.db.uri, config.db.options, function(err) {
  if (err) {
    console.error(chalk.red("Could not connect to the MongoDB."));
    console.log(chalk.red(err));
  }
});

mongoose.connection.on('error', function(err) {
  console.error(chalk.red('MongoDB connection error: ' + err));
  process.exit(-1);
});

var app = require('./config/express')(db);

// require('./config/password')();

var server = app.listen(config.port);
var socket = require('./config/socket')(server);

exports = module.exports = app;

console.log("--");
console.log(chalk.green(config.app.title + ' application started.'));
console.log(chalk.green('Environment: \t' + process.env.NODE_ENV));
console.log(chalk.green('Port: \t\t' + config.port));
console.log(chalk.green('Database: \t' + config.db.uri));
console.log("--");


// app.use('/', routes);
// app.use('/users', users);

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
