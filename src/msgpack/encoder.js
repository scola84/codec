import { Worker } from '@scola/worker';
import { Buffer } from 'buffer/';
import { encode } from 'msgpack-lite';
import type from './type';

export default class MsgpackEncoder extends Worker {
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
    data = encode(data);

    message.body.length = Buffer.byteLength(data);
    message.state.body = true;

    this.pass(message, data, callback);
  }
}
