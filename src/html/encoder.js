import { Worker } from '@scola/worker';
import parser from 'parse5';

export default class HtmlEncoder extends Worker {
  act(message, data, callback) {
    try {
      this._encode(message, data, callback);
    } catch (error) {
      throw new Error('500 ' + error.message);
    }
  }

  _encode(message, data, callback) {
    data = parser.serialize(data);
    message.body.length = data.length;

    this.pass(message, data, callback);
  }
}
