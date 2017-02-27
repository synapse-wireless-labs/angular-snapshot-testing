export default {
  entry: './release/index.js',
  dest: './release/bundles/jasmine-angular-snapshot-testing.umd.js',
  format: 'umd',
  moduleName: 'jasmineAngularSnapshotTesting',
  external: [
    'cheerio',
    'pretty',
    'parse5',
    'diff',
    'chalk',
    'fs',
    'lodash',
    'js-yaml',
    'mkdirp',
  ],
  globals: {
    '@angular/core': 'ng.core',
    '@angular/core/testing': 'ng.core.testing',
    '@ngrx/core': 'ngrx.core',
    'rxjs/Observable': 'Rx',
    'rxjs/Observer': 'Rx',
    'rxjs/operator/share': 'Rx.Observable.prototype',
  }
}