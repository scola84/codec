import { Worker } from '@scola/worker';
import { Buffer } from 'buffer/';
import { encode } from 'msgpack-lite';

export default class MsgpackEncoder extends Worker {
  act(message, data, callback) {
    try {
      this._encode(message, data, callback);
    } catch (error) {
      throw new Error('500 ' + error.message);
    }
  }

  _encode(message, data, callback) {
    data = encode(data);
    message.body.length = Buffer.byteLength(data);

    this.pass(message, data, callback);
  }
}
