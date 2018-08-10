import { Worker } from '@scola/worker';

export default class ChunkedDecoder extends Worker {
  constructor(options = {}) {
    super(options);

    this._maxLength = null;
    this.setMaxLength(options.maxLength);
  }

  setMaxLength(maxLength = 1024 * 1024) {
    this._maxLength = maxLength;
    return this;
  }

  act(message, data, callback) {
    let begin = message.parser.begin;
    let diff = 0;
    let i = begin;

    for (; i < data.length; i += 1) {
      diff = i - 1 - begin;

      if (data[i] === 10) {
        if (message.parser.length === null) {
          [begin, i] = this._parseLength(message, data, callback, begin, i);
        } else if ((message.parser.sliced + diff) === message.parser.length) {
          [begin, i] = this._parsePartial(message, data, callback, begin, i);
        }
      }
    }

    if (begin < i || message.parser.length === null) {
      this._parseComplete(message, data, callback, begin, i);
    }

    message.parser.begin = 0;
  }

  decide(message, data) {
    return data !== null &&
      message.state.body !== true &&
      message.state.headers === true;
  }

  _parseComplete(message, data, callback, begin, i) {
    this.pass(message, data.slice(begin, i), callback);

    message.parser.sliced = (message.parser.sliced || 0) +
      data.slice(begin, i).length;
  }

  _parseLength(message, data, callback, begin, i) {
    message.parser.length = parseInt(data.slice(begin, i - 1), 16);
    message.parser.sliced = 0;

    begin = i + 1;
    i = begin + message.parser.length;

    return [begin, i];
  }

  _parsePartial(message, data, callback, begin, i) {
    this.pass(message, data.slice(begin, i - 1), callback);

    message.state.body = message.parser.length === 0;

    message.parser.length = null;
    message.parser.sliced = (message.parser.sliced || 0) +
      data.slice(begin, i - 1).length;

    begin = i + 1;

    return [begin, i];
  }
}
