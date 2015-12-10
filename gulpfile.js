'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');

const BABEL_PRESETS = {
    presets: ['es2015']
};

gulp.task('compile-libs', () => {
  return gulp.src("lib/**")
    .pipe(babel(BABEL_PRESETS))
    .pipe(gulp.dest("dist/lib"));
});

gulp.task("default", ['compile-libs'], () => {
  return gulp.src("app.js")
    .pipe(babel(BABEL_PRESETS))
    .pipe(gulp.dest("dist"));
});
