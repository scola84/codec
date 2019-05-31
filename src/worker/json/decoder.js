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

  decide(message, data) {
    return data === null ? null : true;
  }

  _decode(message, data, callback) {
    data = (message.parser.json || '') + data;
    message.parser.json = null;

    if (data) {
      data = JSON.parse(data);
    } else {
      data = {};
    }

    this.pass(message, data, callback);
  }
}
