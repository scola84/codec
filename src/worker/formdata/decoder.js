import { Worker } from '@scola/worker';
import Busboy from 'busboy';
import { createWriteStream } from 'fs';
import { ensureDirSync } from 'fs-extra';
import defaults from 'lodash-es/defaults';
import shortid from 'shortid';

export default class FormDataDecoder extends Worker {
  constructor(options = {}) {
    super(options);

    this._config = null;
    this.setConfig(options);
  }

  setConfig(value = {}) {
    this._config = defaults({}, value, {
      base: '/tmp/',
      path: ''
    });

    ensureDirSync(this._config.base + '/' + this._config.path);
    return this;
  }

  act(message, data, callback) {
    try {
      this._decode(message, data, callback);
    } catch (error) {
      throw new Error('400 ' + error.message);
    }
  }

  _decode(message, data, callback) {
    if (typeof message.parser.formdata === 'undefined') {
      this._setup(message, data, callback);
    }

    if (message.state.body === true) {
      message.parser.formdata.end(data);
    } else {
      message.parser.formdata.write(data);
    }
  }

  _set(data, name, value) {
    const isArray = name.slice(-2) === '[]';
    name = isArray ? name.slice(0, -2) : name;

    if (isArray) {
      value = typeof data[name] === 'undefined' ?
        ([value]) : data[name].concat(value);
    }

    data[name] = value;
  }

  _setup(message, data, callback) {
    const options = Object.assign({
      headers: {
        'content-type': (message._original || message)
          .getHeader('Content-Type')
      }
    }, this._config);

    const formdata = new Busboy(options);
    const parsed = {};

    formdata.on('field', (name, value) => {
      this._set(parsed, name, value);
    });

    formdata.on('file', (fieldName, stream, name, encoding, type) => {
      const file = {};

      file.name = name;
      file.type = type;
      file.size = 0;

      file.tmppath = this._config.base + '/' + this._config.path +
        shortid.generate();

      const target = createWriteStream(file.tmppath);

      stream.on('data', (chunk) => {
        file.size += chunk.length;
      });

      stream.on('limit', () => {
        this._set(parsed, fieldName,
          new Error('400 File size exceeds maximum'));
      });

      stream.once('end', () => {
        this._set(parsed, fieldName, file);
      });

      stream.once('error', (error) => {
        this._set(parsed, fieldName, error);
      });

      stream.pipe(target);
    });

    formdata.once('error', (error) => {
      formdata.removeAllListeners();
      message.parser.formdata = null;

      this.fail(message, new Error('400 ' + error.message), callback);
    });

    formdata.once('finish', () => {
      formdata.removeAllListeners();
      message.parser.formdata = null;

      this.pass(message, parsed, callback);
    });

    message.parser.formdata = formdata;
  }
}
