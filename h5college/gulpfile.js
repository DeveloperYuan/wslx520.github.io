'use strict';
const gulp = require('gulp');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
gulp.task('sass', function(){
    return gulp.src('./source/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'));
    })

gulp.task('js', function(){
    return gulp.src('./source/js/*.js')
        // .pipe(uglify())
        .pipe(gulp.dest('./js'));
    })

gulp.task('default', function(){
    gulp.watch('./source/sass/*.scss',['sass']);
    gulp.watch('./source/js/*.js',['js']);
    })