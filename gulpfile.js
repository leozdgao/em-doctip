var gulp = require('gulp');
var babel = require('gulp-babel');
var config = require('./config.json').release;

gulp.task('default', function () {
    return gulp.src(config.server.src)
        .pipe(babel())
        .pipe(gulp.dest(config.server.dist));
});