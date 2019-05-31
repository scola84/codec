import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: './index.js',
  external: [
    'busboy',
    'file-api',
    'fs',
    'fs-extra',
    'msgpack-lite',
    'node-schedule',
    'parse5',
    'shortid'
  ],
  output: [{
    file: 'dist/codec.cjs.js',
    format: 'cjs'
  }, {
    extend: true,
    file: 'dist/codec.umd.js',
    format: 'umd',
    name: 'scola'
  }],
  plugins: [
    resolve(),
    commonjs(),
    json(),
    buble()
  ]
};
