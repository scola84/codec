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
    let i = begin;

    for (; i < data.length; i += 1) {
      if (data[i] === 10) {
        if (message.parser.length === null) {
          message.parser.length = parseInt(data.slice(begin, i - 1), 16);
          begin = i + 1;
          i = begin + message.parser.length;
        } else {
          this.pass(message, data.slice(begin, i - 1), callback);
          message.parser.length = null;
          begin = i + 1;
        }
      }
    }

    if (begin < i || message.parser.length === null) {
      if (message.parser.length === null) {
        message.state.body = true;
      }

      this.pass(message, data.slice(begin, i), callback);
    }

    message.parser.begin = 0;
  }

  decide(message) {
    return message.state.body !== true && message.state.headers === true;
  }
}
