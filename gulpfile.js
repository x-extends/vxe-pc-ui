const gulp = require('gulp')
const del = require('del')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')
const rename = require('gulp-rename')
const replace = require('gulp-replace')
const ts = require('gulp-typescript')
const merge = require('merge-stream')
const pack = require('./package.json')
const tsconfig = require('./tsconfig.json')

const exportModuleName = 'VxeComponents'
const esmOutDir = 'es'
const commOutDir = 'lib'

gulp.task('build_escode', function () {
  return gulp.src([
    'packages/**.ts',
    'packages/**/*.ts',
    '!packages/index.ts'
  ])
    .pipe(replace('process.env.VUE_APP_VXE_TABLE_VERSION', `"${pack.version}"`))
    .pipe(replace('process.env.VUE_APP_VXE_TABLE_ENV', 'process.env.NODE_ENV'))
    .pipe(ts(tsconfig.compilerOptions))
    .pipe(gulp.dest(esmOutDir))
})

gulp.task('build_esjs', gulp.series('build_escode', function () {
  return gulp.src([
    'packages/index.ts'
  ])
    .pipe(replace('process.env.VUE_APP_VXE_TABLE_VERSION', `"${pack.version}"`))
    .pipe(replace('process.env.VUE_APP_VXE_TABLE_ENV', 'process.env.NODE_ENV'))
    .pipe(ts(tsconfig.compilerOptions))
    .pipe(rename({
      basename: 'index',
      extname: '.esm.js'
    }))
    .pipe(gulp.dest(esmOutDir))
}))

gulp.task('build_commoncode', function () {
  return gulp.src([
    'packages/**.ts',
    'packages/**/*.ts',
    '!packages/index.ts'
  ])
    .pipe(replace('process.env.VUE_APP_VXE_TABLE_VERSION', `"${pack.version}"`))
    .pipe(replace('process.env.VUE_APP_VXE_TABLE_ENV', 'process.env.NODE_ENV'))
    .pipe(ts(tsconfig.compilerOptions))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest(commOutDir))
})

gulp.task('build_commonjs', gulp.series('build_commoncode', function () {
  return gulp.src([
    'packages/index.ts'
  ])
    .pipe(replace('process.env.VUE_APP_VXE_TABLE_VERSION', `"${pack.version}"`))
    .pipe(replace('process.env.VUE_APP_VXE_TABLE_ENV', 'process.env.NODE_ENV'))
    .pipe(ts(tsconfig.compilerOptions))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(rename({
      basename: 'index',
      extname: '.common.js'
    }))
    .pipe(gulp.dest(commOutDir))
}))

gulp.task('build_umd', () => {
  return gulp.src('lib_temp/index.umd.js')
    .pipe(replace(`root["${exportModuleName}"] = factory(root["Vue"], root["XEUtils"])`, `{var exportObj = factory(root["Vue"], root["XEUtils"]).default; root["${exportModuleName}"] = exportObj; root["VxeUI"] = exportObj["VxeUI"]}`))
    .pipe(gulp.dest('lib'))
    .pipe(uglify())
    .pipe(rename({
      basename: 'index',
      extname: '.umd.min.js'
    }))
    .pipe(gulp.dest('lib'))
})

gulp.task('clear', () => {
  return del([
    commOutDir,
    esmOutDir
  ])
})

gulp.task('build', gulp.series('clear', gulp.parallel('build_esjs', 'build_commonjs', 'build_umd'), () => {
  return del([
    'lib_temp'
  ])
}))
