var gulp = require('gulp');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');
var karma = require('gulp-karma');

gulp.task('styles', function() {
	gulp.src('sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./public/stylesheets/'));
});

// TODO: Write a short blog post about having some trouble with nodemon and gulp.
gulp.task('nodemon', function() {
	nodemon({script: './bin/www'});
});

// TODO: describe how you run multiple tasks
gulp.task('watch', function() {
	gulp.watch('sass/**/*.scss', ['styles']);
});


gulp.task('test', function () {
    var testFiles = [
        'tests/*.js'
        ];    
    // Be sure to return the stream 
    return gulp.src(testFiles)
        .pipe(karma({
            configFile: 'my.conf.js',
            action: 'watch'
        }))
        .on('error', function (err) {
                // Make sure failed tests cause gulp to exit non-zero 
            throw err;
        });
});