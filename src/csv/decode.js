import { Buffer } from 'buffer/';

const delimiters = [',', ';', '\t'];

const lineEndings = {
  CR: { length: 1, char: 13 },
  CRLF: { length: 2, char: 13 },
  LF: { length: 1, char: 10 }
};

export default function decode(options = {}, data) {
  let {
    delimiter = ',',
      lineEnding = 'LF'
  } = options;

  data = Buffer.from(data.trim());

  if (lineEnding === 'detect') {
    lineEnding = detectLineEnding(data);
  }

  lineEnding = lineEndings[lineEnding];

  if (delimiter === 'detect') {
    delimiter = detectDelimiter(data, lineEnding);
  }

  delimiter = Buffer.from(delimiter)[0];

  let begin = 0;
  let i = 0;
  let line = [];

  let isEscaped = false;
  let isQuoted = false;
  let isValue = false;

  const lines = [];

  for (; i < data.length; i += 1) {
    if (data[i] === 34) {
      ([isQuoted, isValue, isEscaped, i] =
        checkQuote(data, isValue, isEscaped, i));
    } else if (data[i] === delimiter && isValue === false) {
      line[line.length] = parseValue(data, begin, i, isQuoted);
      isQuoted = false;
      begin = i + 1;
    } else if (data[i] === lineEnding.char && isValue === false) {
      line[line.length] = parseValue(data, begin, i, isQuoted);
      lines[lines.length] = line;
      line = [];
      isQuoted = false;
      begin = i + lineEnding.length;
    }
  }

  line[line.length] = parseValue(data, begin, i, isQuoted);
  lines[lines.length] = line;

  return lines;
}

function checkQuote(data, isValue, isEscaped, i) {
  if (isValue === true) {
    if (data[i + 1] === 34) {
      isEscaped = !isEscaped;
      i += 1;
    } else if (isEscaped === false) {
      isValue = false;
    }
  } else {
    isValue = true;
  }

  return [true, isValue, isEscaped, i];
}

function detectDelimiter(data, lineEnding) {
  data = String(data.slice(0, data.indexOf(lineEnding.char)));

  let count = 0;
  let delimiter = ',';
  let match = null;

  for (let i = 0; i < delimiters.length; i += 1) {
    match = data.match(new RegExp(delimiters[i]), 'g');
    delimiter = match && match.length > count ? delimiters[i] : delimiter;
    count = match && match.length > count ? match.length : count;
  }

  return delimiter;
}

function detectLineEnding(data) {
  for (let i = 0; i < data.length; i += 1) {
    if (data[i] === 13) {
      if (data[i + 1] === 10) {
        return 'CRLF';
      }

      return 'CR';
    } else if (data[i] === 10) {
      return 'LF';
    }
  }

  return 'LF';
}

function parseValue(data, begin, i, isQuoted) {
  const quote = (isQuoted ? 1 : 0);
  const value = data.slice(begin + quote, i - quote);
  return String(value).replace(/""/g, '"');
}
