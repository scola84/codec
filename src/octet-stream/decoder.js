import { Worker } from '@scola/worker';
import { Buffer } from 'buffer/';

export default class OctetStreamDecoder extends Worker {
  act(message, data, callback) {
    if (message.state.body !== true) {
      message.parser.octetStream = Buffer.concat([
        message.parser.octetStream || Buffer.from(''),
        data
      ]);

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
    data = Buffer.concat([
      message.parser.octetStream || Buffer.from(''),
      data
    ]);

    message.parser.octetStream = null;

    this.pass(message, data, callback);
  }
}
