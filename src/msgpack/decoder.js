import { Worker } from '@scola/worker';
import { decode } from 'msgpack-lite';

export default class MsgPackDecoder extends Worker {
  act(message, data, callback) {
    if (message.state.body !== true) {
      message.parser.msgpack = (message.parser.msgpack || '') + data;
      return;
    }

    try {
      this._decode(message, data, callback);
    } catch (error) {
      throw new Error('400 ' + error.message);
    }
  }

  _decode(message, data, callback) {
    data = decode((message.parser.msgpack || '') + data);
    message.parser.msgpack = null;

    this.pass(message, data, callback);
  }
}