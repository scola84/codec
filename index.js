import setupClient from './src/helper/setup-client';
import setupServer from './src/helper/setup-server';
import chunked from './src/chunked';
import csv from './src/csv';
import formdata from './src/formdata';
import html from './src/html';
import json from './src/json';
import msgpack from './src/msgpack';
import octetStream from './src/octet-stream';
import plain from './src/plain';
import urlencoded from './src/urlencoded';

export const codec = [
  formdata,
  json,
  html,
  msgpack,
  octetStream,
  urlencoded,
  plain
];

export {
  setupClient,
  setupServer
};

export {
  chunked,
  csv,
  formdata,
  json,
  html,
  msgpack,
  octetStream,
  urlencoded,
  plain
};
