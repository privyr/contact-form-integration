const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

gulp.task('contact-form7-integration', () => {
    return gulp.src('scripts/privyr-wpcf7-intergration.js')
        .pipe(babel())
        .pipe(concat('pvyr-wpcf7.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('scripts'))
});