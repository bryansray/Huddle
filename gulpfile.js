var path = require('path');

var gulp = require('gulp'),
		chalk = require('chalk'),
		del = require('del'),
		requireDir = require('require-dir'),
		debowerify = require('debowerify'),
		babelify = require('babelify'),
		mocha = require('gulp-mocha'),
		plugins = require('gulp-load-plugins')({ rename: {
				"gulp-ruby-sass": "sass"
			}
		});

require('jshint-stylish');

// *****************************************************************
// Load up any application specific tasks ...
// *****************************************************************
var dir = requireDir('./lib/tasks');

var config = {
	bowerDir: './bower_components',

	sass: {
		sassPath: './app/assets/stylesheets',
		outputPath: './public/stylesheets',
		options: {
			sourcemap: true,
			compass: true,
			verbose: true,
			lineNumbers: true
		}
	},

	browserify: { 
		debug: true, 
		transform: [debowerify, babelify] 
	},

	mocha: {
		// reporter: 'dot'
	}
};

// *****************************************************************
// Display Help Information
// *****************************************************************
gulp.task('help', plugins.taskListing);

// *****************************************************************
// General Compilation Tasks
// *****************************************************************
gulp.task('clean:javascript', function() {
	del('public/javascript');
});

// *****************************************************************
// Compilation Tasks
// *****************************************************************
gulp.task('compile:javascript', function() {
	gulp.src('app/assets/javascript/**/*.js')
			.pipe(plugins.browserify(config.browserify))
			.pipe(gulp.dest('public/javascript'));
});

gulp.task('compile:stylesheets', function() {
	return plugins.sass(config.sass.sassPath, config.sass.options)
		.on('error', function(err) {
			console.log("Error: ", err.message);
		})
		.pipe(plugins.sourcemaps.write())
		.pipe(gulp.dest(config.sass.outputPath));
});

gulp.task('compile', ['compile:javascript', 'compile:stylesheets']);

// *****************************************************************
// Lint Tasks
// *****************************************************************
gulp.task("lint:javascript", function() {
	return gulp.src('./app/**/*.js')
		.pipe(plugins.jshint())
		.pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task("lint:stylesheets", function() {
	gulp.src('./app/assets/stylesheets/**/*.scss')
		.pipe(plugins.scssLint());
});

gulp.task('lint', ['lint:javascript', 'lint:stylesheets']);

// *****************************************************************
//  Test Tasks
// *****************************************************************
gulp.task("test:javascript", function() {
	gulp.src('./app/tests/**/*_spec.js')
		.pipe(mocha(config.mocha));
});

// *****************************************************************
// 
// *****************************************************************
gulp.task('server', function() {
	plugins.nodemon({
		script: './app.js',
		ext: 'js html',
		env: { 'NODE_ENV': 'development' }
	});
});

// *****************************************************************
// 
// *****************************************************************
gulp.task('watch', function() {
	gulp.watch('app/assets/stylesheets/**/*.scss', ['sass']);
	// gulp.watch('app/assets/javascripts/**/*.js', ['javascripts'])
});