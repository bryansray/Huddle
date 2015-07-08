var path = require('path');

var gulp = require('gulp'),
		chalk = require('chalk'),
		del = require('del'),
		requireDir = require('require-dir'),
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
	sass: {
		sassPath: './app/assets/stylesheets',
		outputPath: './public/stylesheets',

		options: {
			sourcemap: true,
			compass: true,
			verbose: true,
			lineNumbers: true,

			loadPath: './node_modules/font-awesome/scss',
		}
	},

	jshint: {
		config: { esnext: true },
		reporter: 'jshint-stylish'
	},

	browserify: { 
		debug: true, 
		transform: [babelify],
		paths: ['./node_modules', './app/assets/javascript']
	},

	mocha: {
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

gulp.task('clean:stylesheets', function() {
	del('public/stylesheets');
});

gulp.task('clean:fonts', function() {
	del('public/fonts');
});

gulp.task('clean', ['clean:stylesheets', 'clean:javascript', 'clean:fonts']);

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
		.pipe(plugins.autoprefixer())
		.pipe(plugins.sourcemaps.write())
		.pipe(gulp.dest(config.sass.outputPath));
});

gulp.task('compile:fonts', function() {
	gulp.src('./node_modules/font-awesome/fonts/*')
	.pipe(gulp.dest('public/fonts'));

	return plugins.sass('./node_modules/font-awesome/scss', config.sass.options)
	.on('error', function(err) { console.log("Error: ", err.message) })
	.pipe(plugins.autoprefixer())
	.pipe(plugins.sourcemaps.write())
	.pipe(gulp.dest(config.sass.outputPath));
});

gulp.task('compile', ['compile:javascript', 'compile:stylesheets', 'compile:fonts']);

// *****************************************************************
// Lint Tasks
// *****************************************************************
gulp.task("lint:javascript", function() {
	return gulp.src('./app/**/*.js')
		.pipe(plugins.jshint(config.jshint.config))
		.pipe(plugins.jshint.reporter(config.jshint.reporter));
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
	gulp.src('./tests/**/*_spec.js')
		.pipe(mocha(config.mocha));
});

// *****************************************************************
// 
// *****************************************************************
gulp.task('server', function() {
	plugins.nodemon({
		script: './app.js',
		ignore: ['app/assets/', 'public', 'tests', 'bin', 'lib', 'node_modules', 'bower_components', '.git'],
		ext: 'js html',
		env: { 'NODE_ENV': 'development' }
	});
});

// *****************************************************************
// 
// *****************************************************************
gulp.task('watch', function() {
	gulp.watch('app/assets/stylesheets/**/*.scss', ['lint:stylesheets', 'compile:stylesheets']);
	gulp.watch('app/assets/javascript/**/*.js', [/*'lint:javascript', */'compile:javascript']);
});