var path = require('path');

var gulp = require('gulp'),
		chalk = require('chalk'),
		del = require('del'),
		requireDir = require('require-dir'),
		babelify = require('babelify'),
		mocha = require('gulp-mocha'),
		bourbon = require('node-bourbon'),
		neat = require('node-neat'),
		argv = require('yargs')
						.default('production', false)
						.argv,
		plugins = require('gulp-load-plugins')({ rename: {
				"gulp-ruby-sass": "sass",
				"gulp-util": "gutil"
			}
		});

require('jshint-stylish');

// *****************************************************************
// Load up any application specific tasks ...
// *****************************************************************
var dir = requireDir('./lib/tasks');

var config = {
	paths: {
		javascript: 'public/javascript'
	},

	sass: {
		sassPath: './app/assets/stylesheets',
		outputPath: './public/stylesheets',

		options: {
			sourcemap: !argv.production,
			compass: true,
			verbose: true,
			lineNumbers: true,

			loadPath: bourbon.includePaths.concat(neat.includePaths).concat(['./node_modules/font-awesome/scss']),
		}
	},

	jshint: {
		config: { esnext: true },
		reporter: 'jshint-stylish'
	},

	browserify: { 
		debug: !argv.production, 
		transform: [babelify],
		insertGlobals: true,
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
	var handleErrors = function(err) { 
		plugins.gutil.beep(); 
		plugins.gutil.log(err.stack);
	};

	gulp.src('app/assets/javascript/**/*.js')
			.pipe(plugins.browserify(config.browserify)
			.on('error', handleErrors))
			.pipe(gulp.dest(config.paths.javascript));
});

gulp.task('compile:stylesheets', function() {
	return plugins.sass(config.sass.sassPath, config.sass.options)
		.on('error', function(err) {
			plugins.gutil.beep(); 
			plugins.gutil.log(err.stack);
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
gulp.task('watch', ['compile'], function() {
	gulp.watch('app/assets/stylesheets/**/*.scss', ['lint:stylesheets', 'compile:stylesheets']);
	gulp.watch('app/assets/javascript/**/*.js', [/*'lint:javascript', */'compile:javascript']);
});