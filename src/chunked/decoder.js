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
    for (; message.parser.end < data.length; message.parser.end += 1) {
      if (message.state.body === true) {
        break;
      }

      if (data[message.parser.end] === 10) {
        this._processChunk(message, data, callback);
      }
    }
  }

  decide(message) {
    return message.state.body !== true && message.state.headers === true;
  }

  _completeChunk(message, data) {
    message.parser.data = data.slice(message.parser.begin,
      message.parser.begin + message.parser.length);

    message.parser.end = message.parser.begin + message.parser.length;
    message.parser.begin = message.parser.end;
  }

  _createChunk(message, data) {
    message.parser.length = parseInt(data.slice(message.parser.begin,
      message.parser.end), 16);

    if (Number.isNaN(message.parser.length)) {
      throw new Error('400 Given chunk length is not an integer' +
        ` (${data.slice(message.parser.begin, message.parser.end)})`);
    }

    message.body.length = (message.body.length || 0) + message.parser.length;

    if (message.body.length > this._maxLength) {
      throw new Error('413 Content length exceeds maximum' +
        ` (${message.body.length} > ${this._maxLength})`);
    }

    message.parser.end += 1;
    message.parser.data = data.slice(message.parser.end,
      message.parser.end + message.parser.length);

    message.parser.end += message.parser.data.length;
    message.parser.begin = message.parser.end;
  }

  _processChunk(message, data, callback) {
    if (message.parser.length === null) {
      this._createChunk(message, data);
    } else {
      this._completeChunk(message, data);
    }

    if (message.parser.data.length > message.parser.length) {
      throw new Error('413 Given chunk length does not match actual length' +
        ` (${message.parser.data.length} !== ${message.parser.length})`);
    }

    if (message.parser.data.length === message.parser.length) {
      this._releaseChunk(message, data.slice(message.parser.end), callback);
    }

    message.parser.end += 1;
    message.parser.begin = message.parser.end;
  }

  _releaseChunk(message, data, callback) {
    if (message.parser.length === 0) {
      message.state.body = true;
      message.state.headers = false;
    } else {
      data = message.parser.data;
    }

    message.parser.data = null;
    message.parser.length = null;

    this.pass(message, data, callback);
  }
}
