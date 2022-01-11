var gulp = require("gulp"),
    sass = require('gulp-sass')(require('sass'));
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    cssnano = require("cssnano"), 
    sourcemaps = require("gulp-sourcemaps"),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    gulpCopy = require('gulp-copy'),
    flatten = require('gulp-flatten'),
    browserSync = require("browser-sync").create();

const { series } = require('gulp');

var paths = {
    styles: {
        // Source files
        src: "src/assets/scss/**/*.scss",
        // Compiled files will end up here
        dest: "public/css"
    },
    js: {
        // Source files
        src: "src/assets/js/*.js",
        // Compiled files will end up here
        dest: "public/js"
    },
    templates: {
        // Source files
        src: "src/templates/**/*",
        // Compiled files will end up here
        dest: "public/"
    },
    fonts: {
        // Source files
        src: "src/assets/fonts/**/*",
        // Compiled files will end up here
        dest: "public/fonts"
    },
    images: {
        // Source files
        src: "src/assets/images/**/*",
        // Compiled files will end up here
        dest: "public/images"
    }
};

// Define tasks after requiring dependencies
// SASS/CSS
function style() {
    return gulp
        .src(paths.styles.src)
        // Initialize sourcemaps before compilation starts
        .pipe(sourcemaps.init())
        // Use sass with the files found, and log any errors
        .pipe(sass())
        .on("error", sass.logError)
        // // Use postcss with autoprefixer and compress the compiled file using cssnano
        // .pipe(postcss([autoprefixer(), cssnano()]))
        // Now add/write the sourcemaps
        .pipe(sourcemaps.write())
        // Concat
        .pipe(concat("custom.css"))
        // Destination
        .pipe(gulp.dest(paths.styles.dest))
        // Add browsersync stream pipe after compilation
        .pipe(browserSync.stream())
}

// JS
function js(){
    return gulp
        .src(paths.js.src)
        .pipe(concat('custom.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.js.dest))
}

// Copy fonts
function copyFonts(){
    return gulp
        .src(paths.fonts.src)
        .pipe(flatten())
        .pipe(gulp.dest(paths.fonts.dest))
}

// Copy images
function copyImages(){
    return gulp
        .src(paths.images.src)
        .pipe(flatten())
        .pipe(gulp.dest(paths.images.dest))
}

// Copy templates files
function copytemplates(){
    return gulp
        .src(paths.templates.src)
        .pipe(gulp.dest(paths.templates.dest))
}

// Watch function
function watch() {
    browserSync.init({
        // You can tell browserSync to use this directory and serve it as a mini-server
        // server: {
        //     baseDir: "/Users/danielrees/Sites/.../public/"
        // }
        // If you are already serving your website locally using something like apache
        // You can use the proxy setting to proxy that instead
        proxy: "http://bridge.test/"
    });
    // gulp.watch takes in the location of the files to watch for changes
    // and the name of the function we want to run on change
    gulp.watch(paths.styles.src, style)
    gulp.watch(paths.js.src, js)
    gulp.watch(paths.templates.src, copytemplates)
    gulp.watch(paths.images.src, copyImages)
}

function build(cb) {
    cb();
}

exports.build = build;
exports.copyFonts = copyFonts;
exports.copyImages = copyImages;
exports.copytemplates = copytemplates;
exports.js = js;
exports.style = style;
exports.watch = watch;
exports.default = series(style, js, copytemplates, copyFonts, copyImages);