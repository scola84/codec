import { Worker } from '@scola/worker';
import { FormData } from 'file-api';

export default class FormDataEncoder extends Worker {
  act(message, data, callback) {
    try {
      this._encode(message, data, callback);
    } catch (error) {
      throw new Error('500 ' + error.message);
    }
  }

  _encode(message, data, callback) {
    const keys = Object.keys(data);
    const form = new FormData();

    let name = null;
    let value = null;
    let isArray = null;

    for (let i = 0; i < keys.length; i += 1) {
      name = keys[i];
      value = data[name];
      isArray = Array.isArray(value);

      name = isArray ? name + '[]' : name;
      value = isArray ? value : [value];

      for (let j = 0; j < value.length; j += 1) {
        form.append(name, this._isEmpty(value[j]) ? '' : value[j]);
      }
    }

    this.pass(message, form, callback);
  }

  _isEmpty(value) {
    return typeof value === 'undefined' ||
      value === null ||
      value === '';
  }
}
