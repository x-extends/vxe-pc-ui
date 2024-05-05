const gulp = require('gulp')
const del = require('del')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')
const rename = require('gulp-rename')
const replace = require('gulp-replace')
const ts = require('gulp-typescript')
const pack = require('./package.json')
const tsconfig = require('./tsconfig.json')

const exportModuleName = 'VxeUI'
const esmOutDir = 'es'
const commOutDir = 'lib'

gulp.task('build_escode', function () {
  return gulp.src([
    'src/**/*.ts',
    '!src/index.ts'
  ]).pipe(ts(tsconfig.compilerOptions))
    .pipe(gulp.dest(esmOutDir))
})

gulp.task('build_esjs', gulp.series('build_escode', function () {
  return gulp.src([
    'src/index.ts'
  ]).pipe(ts(tsconfig.compilerOptions))
    .pipe(rename({
      basename: 'index',
      extname: '.esm.js'
    }))
    .pipe(gulp.dest(esmOutDir))
}))

gulp.task('build_commoncode', function () {
  return gulp.src([
    'src/**/*.ts',
    '!src/index.ts'
  ]).pipe(ts(tsconfig.compilerOptions))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest(commOutDir))
})

gulp.task('build_commonjs', gulp.series('build_commoncode', function () {
  return gulp.src([
    'src/index.ts'
  ]).pipe(ts(tsconfig.compilerOptions))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(rename({
      basename: 'index',
      extname: '.common.js'
    }))
    .pipe(gulp.dest(commOutDir))
}))

gulp.task('build_umd', function () {
  return gulp.src([
    'src/index.ts'
  ]).pipe(ts(tsconfig.compilerOptions))
    .pipe(babel({
      moduleId: pack.name,
      presets: ['@babel/env'],
      plugins: [['@babel/transform-modules-umd', {
        globals: {
          [pack.name]: exportModuleName,
          'xe-utils': 'XEUtils'
        },
        exactGlobals: true
      }]]
    }))
    .pipe(replace(`global.${exportModuleName} = mod.exports`, `global.${exportModuleName} = mod.exports.default`))
    .pipe(rename({
      basename: 'index',
      suffix: '.umd',
      extname: '.js'
    }))
    .pipe(gulp.dest(commOutDir))
    .pipe(uglify())
    .pipe(rename({
      basename: 'index',
      suffix: '.umd.min',
      extname: '.js'
    }))
    .pipe(gulp.dest(commOutDir))
})

gulp.task('clear', () => {
  return del([
    commOutDir,
    esmOutDir
  ])
})

gulp.task('build', gulp.series('clear', gulp.parallel('build_esjs', 'build_commonjs', 'build_umd')))
