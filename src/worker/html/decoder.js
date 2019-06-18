import { Worker } from '@scola/worker';
import { Struct } from './struct';

export class Decoder extends Worker {
  act(message, data, callback) {
    if (message.state.body !== true) {
      message.parser.html = (message.parser.html || '') + data;
      return;
    }

    try {
      this.decode(message, data, callback);
    } catch (error) {
      throw new Error('400 ' + error.message);
    }
  }

  decide(message, data) {
    return data === null ? null : true;
  }

  decode(message, data, callback) {
    data = (message.parser.html || '') + data;
    message.parser.html = null;

    const struct = new Struct(data);

    this.pass(message, struct, callback);
  }
}
