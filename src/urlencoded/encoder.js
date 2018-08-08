import { Worker } from '@scola/worker';
import { Buffer } from 'buffer/';
import qs from 'qs';

export default class UrlencodedEncoder extends Worker {
  act(message, data, callback) {
    try {
      this._encode(message, data, callback);
    } catch (error) {
      throw new Error('500 ' + error.message);
    }
  }

  _encode(message, data, callback) {
    data = qs.stringify(data);
    message.body.length = Buffer.byteLength(data);

    this.pass(message, data, callback);
  }
}
