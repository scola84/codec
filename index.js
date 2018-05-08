import setupClient from './src/helper/setup-client';
import setupServer from './src/helper/setup-server';
import chunked from './src/chunked';
import formdata from './src/formdata';
import json from './src/json';
import msgpack from './src/msgpack';
import urlencoded from './src/urlencoded';

export const codec = [
  formdata,
  json,
  msgpack,
  urlencoded
];

export {
  setupClient,
  setupServer
};

export {
  chunked,
  json,
  formdata,
  msgpack,
  urlencoded
};
