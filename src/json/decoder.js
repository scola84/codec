import { Worker } from '@scola/worker';

export default class JsonDecoder extends Worker {
  act(message, data, callback) {
    if (message.state.body !== true) {
      message.parser.json = (message.parser.json || '') + data;
      return;
    }

    try {
      this._decode(message, data, callback);
    } catch (error) {
      throw new Error('400 ' + error.message);
    }
  }

  _decode(message, data, callback) {
    data = JSON.parse((message.parser.json || '') + data);
    message.parser.json = null;

    this.pass(message, data, callback);
  }
}