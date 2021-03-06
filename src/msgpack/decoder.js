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

  decide(message, data) {
    return data === null ? null : true;
  }

  _decode(message, data, callback) {
    data = (message.parser.msgpack || '') + data;
    message.parser.msgpack = null;

    if (data) {
      data = decode(data);
    } else {
      data = {};
    }

    this.pass(message, data, callback);
  }
}
