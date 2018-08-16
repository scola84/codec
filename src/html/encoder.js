import { Worker } from '@scola/worker';
import { Buffer } from 'buffer/';
import parser from 'parse5';
import type from './type';

export default class HtmlEncoder extends Worker {
  act(message, data, callback) {
    try {
      this._encode(message, data, callback);
    } catch (error) {
      throw new Error('500 ' + error.message);
    }
  }

  decide(message) {
    return message.state.body !== true &&
      message.body.dataType !== type;
  }

  _encode(message, data, callback) {
    data = parser.serialize(data);

    message.body.length = Buffer.byteLength(data);
    message.state.body = true;

    this.pass(message, data, callback);
  }
}
