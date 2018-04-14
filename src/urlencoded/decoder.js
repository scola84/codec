import { Worker } from '@scola/worker';
import qs from 'qs';

export default class UrlencodedDecoder extends Worker {
  act(message, data, callback) {
    if (message.state.body !== true) {
      message.parser.urlencoded = (message.parser.urlencoded || '') + data;
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
    data = qs.parse((message.parser.urlencoded || '') + data);
    message.parser.urlencoded = null;

    this.pass(message, data, callback);
  }
}
