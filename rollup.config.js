import buble from 'rollup-plugin-buble';
import builtins from 'rollup-plugin-node-builtins';
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
    name: 'scola.codec'
  }],
  plugins: [
    resolve(),
    commonjs(),
    builtins(),
    json(),
    buble()
  ]
};
