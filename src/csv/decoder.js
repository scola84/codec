import { Worker } from '@scola/worker';
import decode from './decode';

export default class CsvDecoder extends Worker {
  constructor(options = {}) {
    super(options);

    this._delimiter = null;
    this.setDelimiter(options.delimiter);
  }

  setDelimiter(value = ',') {
    this._delimiter = value;
    return this;
  }

  act(message, data, callback) {
    if (message.state.body !== true) {
      message.parser.csv = (message.parser.csv || '') + data;
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
    data = decode({
      delimiter: this._delimiter
    }, (message.parser.csv || '') + data);

    message.parser.csv = null;

    this.pass(message, data, callback);
  }
}
