'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

const BABEL_PRESETS = {
    presets: ['stage-0', 'es2015']
};

gulp.task('compile-libs', () => {
  return gulp.src("lib/**")
    .pipe(babel(BABEL_PRESETS))
    .pipe(uglify())
    .pipe(gulp.dest("es5/lib"));
});

gulp.task("default", ['compile-libs'], () => {
  return gulp.src("app.js")
    .pipe(babel(BABEL_PRESETS))
    .pipe(uglify())
    .pipe(gulp.dest("es5"));
});
