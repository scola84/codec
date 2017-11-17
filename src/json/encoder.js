import { Worker } from '@scola/worker';

export default class JsonEncoder extends Worker {
  act(message, data, callback) {
    try {
      this._encode(message, data, callback);
    } catch (error) {
      throw new Error('500 ' + error.message);
    }
  }

  _encode(message, data, callback) {
    data = JSON.stringify(data);
    message.body.length = data.length;

    this.pass(message, data, callback);
  }
}
