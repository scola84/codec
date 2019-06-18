import { Worker } from '@scola/worker';
import { Buffer } from 'buffer/';
import { Struct } from './struct';
import { type } from './type';

export class Encoder extends Worker {
  constructor(options = {}) {
    super(options);

    this._delimiter = null;
    this._fields = null;
    this._lineEnding = null;

    this.setDelimiter(options.delimiter);
    this.setFields(options.fields);
    this.setLineEnding(options.lineEnding);
  }

  getDelimiter() {
    return this._delimiter;
  }

  setDelimiter(value = ',') {
    this._delimiter = value;
    return this;
  }

  getFields() {
    return this._fields;
  }

  setFields(value = []) {
    this._fields = value;
    return this;
  }

  getLineEnding() {
    return this._lineEnding;
  }

  setLineEnding(value = 'LF') {
    this._lineEnding = value;
    return this;
  }

  act(message, data, callback) {
    try {
      this.encode(message, data, callback);
    } catch (error) {
      throw new Error('500 ' + error.message);
    }
  }

  decide(message) {
    return message.state.body !== true &&
      message.body.dataType !== type;
  }

  encode(message, data, callback) {
    const struct = new Struct({
      delimiter: this._delimiter,
      fields: this._fields,
      lineEnding: this._lineEnding
    }, data);

    data = struct.encode();

    message.body.length = Buffer.byteLength(data);
    message.state.body = true;

    this.pass(message, data, callback);
  }
}
