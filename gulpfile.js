var path = require('path');

var gulp = require('gulp'),
		requireDir = require('require-dir'),
		debowerify = require('debowerify'),
		babelify = require('babelify'),
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
	}
};

// *****************************************************************
// Display Help Information
// *****************************************************************
gulp.task('help', plugins.taskListing);

// *****************************************************************
// Compilation Tasks
// *****************************************************************
gulp.task('compile:javascript', function() {
	gulp.src('bower_components/jquery/dist/jquery.js')
			.pipe(gulp.dest('public/javascripts'));

	gulp.src('app/assets/javascript/application.js')
			.pipe(plugins.browserify({ transform: [debowerify, babelify] }))
			.pipe(gulp.dest('public/javascripts'));
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