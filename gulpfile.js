const gulp = require('gulp');
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const sass = require('gulp-sass');
const concatCss = require('gulp-concat-css');
const path = require('path');
const shell = require('gulp-shell');
const pkg = require('./package.json');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json', {
    isolatedModules: false
});
// const generateDocs = require('./scripts/generate-docs/generateDocs');

const jsSource = [
    'src/**/*.{js,jsx}',
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.{stories,spec,test}.{js,jsx}',
];
const cssSource = 'src/**/*.{css,scss}';

/** ======================
 ========= CLEAN =========
 ====================== */

gulp.task('clean', () => gulp
.src(['dist/', 'split-css/', 'lib/'], { allowEmpty: true })
.pipe(clean()));

/** ======================
 ========== TS ==========
 ====================== */

gulp.task('transpile-typescript', () => gulp
    .src(['src/**/*.{ts,tsx}', 'src/globals.d.ts'])
    .pipe(
        tsProject()
    )
    .pipe(
        gulp.dest("dist/")
    )
)

/** ======================
 ========== ESM ==========
 ====================== */

const esmDestination = path.dirname(pkg.module);

gulp.task('transpile-esm', () => gulp
.src(jsSource)
.pipe(
    babel({
        presets: [['./babelPreset.js', { cssImports: 'rename' }]],
    })
)
.pipe(gulp.dest(esmDestination)));

gulp.task('compile-scss-esm', () => gulp.src(cssSource).pipe(sass()).pipe(gulp.dest(esmDestination)));

gulp.task('build-esm', gulp.parallel('transpile-esm', 'compile-scss-esm'));

/** ======================
 ========== CJS ==========
 ====================== */

const cjsDestination = path.dirname(pkg.main);

gulp.task('transpile-cjs', () => gulp
.src(jsSource)
.pipe(
    babel({
        presets: [
            ['./babelPreset.js', { cjs: true, cssImports: 'rename' }],
        ],
    })
)
.pipe(gulp.dest(cjsDestination)));

gulp.task('compile-scss-cjs', () => gulp.src(cssSource).pipe(sass()).pipe(gulp.dest(cjsDestination)));

gulp.task('build-cjs', gulp.parallel('transpile-cjs', 'compile-scss-cjs'));

/** ======================
 ===== CJS CSS-SPLIT =====
 ====================== */

gulp.task('transpile-cjs-split-css', () => gulp
.src(jsSource)
.pipe(
    babel({
        presets: [
            ['./babelPreset.js', { cjs: true, cssImports: 'remove' }],
        ],
    })
)
.pipe(gulp.dest('dist/cjs-split-css/')));

gulp.task('bundle-css', () => gulp
.src(cssSource)
.pipe(sass())
.pipe(concatCss('styles.css'))
.pipe(gulp.dest('dist/')));

gulp.task(
    'build-cjs-split-css',
    gulp.parallel('transpile-cjs-split-css', 'bundle-css')
);

/** ======================
 ========== UMD ==========
 ====================== */

// gulp.task('build-umd', shell.task('rollup -c', { quiet: true }));

/** ======================
 ===== GENERATE DOCS =====
 ====================== */

// gulp.task('generate-docs', generateDocs);

/** ======================
 ========= BUILD =========
 ====================== */

gulp.task(
    'build',
    gulp.series(
        'clean',
        gulp.parallel(
            'build-esm',
            'build-cjs',
            'build-cjs-split-css',
            // 'build-umd',
            // 'generate-docs'
        ),
        'transpile-typescript'
    )
);
