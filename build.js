const {readdirSync, readFileSync, writeFileSync} = require('fs');
const path = require('path');
const posthtml = require('posthtml');
const components = require('posthtml-component');
const beautify = require('posthtml-beautify');
const posthtmlFetch = require('posthtml-fetch')

const src = './src/pages/';
const dist = './dist/';

const options = {};

readdirSync(src).forEach(file => {
  if (file.endsWith('.html')) {
    const html = readFileSync(path.resolve(`${src}${file}`), 'utf-8');

    posthtml([
     // posthtmlFetch(),
      components({
        root: './src',
        folders: ['components', 'layouts'],
        namespaces: {
          "name": "ui",
          "root": "./node_modules/posthtml-bootstrap-ui/src",
          "fallback": "./src/",
          "custom": "./src/custom/"
        },
        strict: true,
        expressions: {
          locals: {
            title: 'PostHTML UI'
          },
          strictMode: false
        }
      }),
      posthtmlFetch(),

      beautify({
        rules: {
          indent: 2,
          blankLines: false,
          sortAttr: false
        }
      }),
    ])
      .process(html, options)
      .then(result => {
        writeFileSync(path.resolve(`${dist}${file}`), result.html, 'utf-8');
      });
  }
});
