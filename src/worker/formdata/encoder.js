import { Worker } from '@scola/worker';
import type from './type';

export default class FormDataEncoder extends Worker {
  act(message, data, callback) {
    try {
      this._encode(message, data, callback);
    } catch (error) {
      throw new Error('500 ' + error.message);
    }
  }

  decide(message) {
    return message.state.body !== true &&
      message.body.dataType !== type;
  }

  _encode(message, data, callback) {
    const keys = Object.keys(data);
    const form = new FormData();

    let name = null;
    let value = null;

    for (let i = 0; i < keys.length; i += 1) {
      name = keys[i];
      value = data[name];
      value = Array.isArray(value) ? value : [value];

      for (let j = 0; j < value.length; j += 1) {
        form.append(name, value[j]);
      }
    }

    message.state.body = true;

    this.pass(message, form, callback);
  }
}
