"use strict";

const {src, dest} = require("gulp");
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify-es').default;
const plumber = require('gulp-plumber');
const panini = require('panini');
const imagemin = require('gulp-imagemin');
const del = require('del');
const notify = require('gulp-notify');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const browserSync = require('browser-sync').create();
const groupMediaQueries = require('gulp-group-css-media-queries');
const cleanCss = require('gulp-clean-css');
// const webP = require('gulp-webp');
// const webPHtml = require('gulp-webp-in-html');
const webPCss = require('gulp-webpcss');
const sourcemaps = require('gulp-sourcemaps');



/* Paths */

const distPath = "dist/";
const srcPath = "src/";

const path = {
    build: {
        html:   distPath,
        css:    distPath + 'assets/css/',
        js:     distPath + 'assets/js',
        img:    distPath + 'assets/img/',
        fonts:  distPath + 'assets/fonts/',
    },
    src: {
        html:   srcPath + '*.html',
        css:    srcPath + 'assets/scss/style.scss',
        js:     srcPath + 'assets/js/*.js',
        img:    srcPath + 'assets/img/**/*.{jpg,png,svg,gif,ico,webp}',
        fonts:  srcPath + 'assets/fonts/**/*.{eot,woff,woff2,ttf,svg}'
    },
    watch: {
        html:   srcPath + '**/*.html',
        css:    srcPath + 'assets/scss/**/*.scss',
        js:     srcPath + 'assets/js/**/*.js',
        img:    srcPath + 'assets/img/**/*.{jpg,png,svg,gif,ico,webp}',
        fonts:  srcPath + 'assets/fonts/**/*.{eot,woff,woff2,ttf,svg}'
    },
    clean: './' + distPath
};



/* Tasks */

const serve = () => {
    browserSync.init({
        server: {
            baseDir: distPath
        }
    })
};

const html = () =>{
    panini.refresh();
    return gulp.src(path.src.html, {base: srcPath})
        .pipe(plumber())
        .pipe(panini({
            root:       srcPath,
            layouts:    srcPath + 'layouts/',
            partials:   srcPath + 'partials/',
            helpers:    srcPath + 'helpers/',
            data:       srcPath + 'data/'
        }))
        // .pipe(webPHtml())
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.reload({stream: true}));
};

const css = () =>
    gulp.src(path.src.css, {base: srcPath + "assets/scss/"})
        .pipe(plumber({
            errorHandler : function(err) {
                notify.onError({
                    title:    "SCSS Error",
                    message:  "Error: <%= error.message %>"
                })(err);
                this.emit('end');
            }
        }))
        .pipe(
            sass({
                includePaths: './node_modules/',
            })
        )
        .pipe(groupMediaQueries())
        .pipe(
            autoprefixer({
                cascade: true
            })
        )
        // .pipe(webPCss({ }))
        // .pipe(gulp.dest(path.build.css))
        .pipe(cleanCss())
        .pipe(
            rename({
                suffix: '.min',
                extname: '.css'
            })
        )
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.reload({stream: true}));

const cssWatch = () =>
    src(path.src.css, {base: srcPath + "assets/scss/"})
        .pipe(plumber({
            errorHandler : function(err) {
                notify.onError({
                    title:    "SCSS Error",
                    message:  "Error: <%= error.message %>"
                })(err);
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: './node_modules/'
        }))
        .pipe(groupMediaQueries())
        // .pipe(webPCss({ }))
        .pipe(rename({
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(dest(path.build.css))
        .pipe(browserSync.reload({stream: true}));

const js = () =>
    gulp.src(path.src.js, {base: srcPath + "assets/js/"})
        .pipe(plumber({
            errorHandler : function(err) {
                notify.onError({
                    title:    "JS Error",
                    message:  "Error: <%= error.message %>"
                })(err);
                this.emit('end');
            }
        }))
        // .pipe(sourcemaps.init())
        // .pipe(webpackStream({
        //     mode: "production",
        //     output: {
        //         filename: 'app.js',
        //     },
        //     module: {
        //         rules: [
        //             {
        //                 test: /\.(js)$/,
        //                 exclude: /(node_modules)/,
        //                 loader: 'babel-loader',
        //                 query: {
        //                     presets: ['@babel/preset-env']
        //                 }
        //             }
        //         ]
        //     }
        // }))
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.reload({stream: true}));

const jsWatch = () =>
    src(path.src.js, {base: srcPath + 'assets/js/'})
        .pipe(plumber({
            errorHandler : function(err) {
                notify.onError({
                    title:    "JS Error",
                    message:  "Error: <%= error.message %>"
                })(err);
                this.emit('end');
            }
        }))
        // .pipe(webpackStream({
        //     mode: "development",
        //     output: {
        //         filename: 'app.js',
        //     }
        // }))
        .pipe(dest(path.build.js))
        .pipe(browserSync.reload({stream: true}));

const images = () =>
    gulp.src(path.src.img)
        // .pipe(
        //     webP({
        //         quality: 60
        //     })
        // )
        // .pipe(gulp.dest(path.build.img))
        // .pipe(gulp.src(path.src.img))
        .pipe(
            imagemin([
                imagemin.gifsicle({interlaced: true}),
                imagemin.mozjpeg({quality: 95, progressive: true}),
                imagemin.optipng({optimizationLevel: 5}),
                imagemin.svgo({
                    plugins: [
                        { removeViewBox: true },
                        { cleanupIDs: false }
                    ]
                })
            ])
        )
        .pipe(gulp.dest(path.build.img))
        .pipe(browserSync.reload({stream: true}));

const fonts = () =>
    gulp.src(path.src.fonts)
        .pipe(dest(path.build.fonts))
        .pipe(browserSync.reload({stream: true}));

const clean = () => del(path.clean);

const watchFiles = () => {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], cssWatch);
    gulp.watch([path.watch.js], jsWatch);
    gulp.watch([path.watch.img], images);
    gulp.watch([path.watch.fonts], fonts);
};

const build = gulp.series(clean, gulp.parallel(css, html, js, images, fonts));
const watch = gulp.parallel(build, watchFiles, serve);



/* Exports Tasks */

exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.fonts = fonts;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;