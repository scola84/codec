import { Worker } from '@scola/worker';
import parser from 'parse5';

export default class HtmlDecoder extends Worker {
  act(message, data, callback) {
    if (message.state.body !== true) {
      message.parser.html = (message.parser.html || '') + data;
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
    data = (message.parser.html || '') + data;
    message.parser.html = null;

    if (data) {
      data = parser.parse(data);
      data.toString = () => parser.serialize(data);
    }

    this.pass(message, data, callback);
  }
}
