import { Worker } from '@scola/worker';

export default class PlainDecoder extends Worker {
  act(message, data, callback) {
    if (message.state.body !== true) {
      message.parser.plain = (message.parser.plain || '') + data;
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
    data = (message.parser.plain || '') + data;
    message.parser.plain = null;

    this.pass(message, data, callback);
  }
}
