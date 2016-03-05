var gulp = require('gulp');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');
var karma = require('karma');
var karmaServer = karma.Server;

gulp.task('styles', function() {
	gulp.src('sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./public/stylesheets/'));
});

gulp.task('nodemon', function() {
	nodemon({script: './bin/www'});
});

gulp.task('watch', function() {
	gulp.watch('sass/**/*.scss', ['styles']);
});


gulp.task('test', function () {
    new karmaServer({
        configFile: __dirname + '/my.conf.js',
        singleRun: true
    }).start();
});