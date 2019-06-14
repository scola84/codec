import { Worker } from '@scola/worker';
import { Buffer } from 'buffer/';
import type from './type';

export default class PlainEncoder extends Worker {
  act(message, data, callback) {
    try {
      this.encode(message, data, callback);
    } catch (error) {
      throw new Error('500 ' + error.message);
    }
  }

  decide(message) {
    return message.state.body !== true &&
      message.body.dataType !== type;
  }

  encode(message, data, callback) {
    data = String(data);

    message.body.length = Buffer.byteLength(data);
    message.state.body = true;

    this.pass(message, data, callback);
  }
}