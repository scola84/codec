import { Buffer } from 'buffer/';

const delimiters = [',', ';', '\t'];

export default function decode({ delimiter = ',' }, data) {
  if (delimiter === 'detect') {
    delimiter = detect(data) || delimiter;
  }

  delimiter = Buffer.from(delimiter)[0];
  data = Buffer.from(data);

  const lines = [];

  let begin = 0;
  let i = 0;
  let line = [];

  let isQuoted = false;
  let isValue = false;

  for (; i < data.length; i += 1) {
    if (data[i] === 34) {
      isQuoted = true;
      isValue = isValue &&
        (data[i + 1] === delimiter || data[i + 1] === 13) ?
        false : true;
    } else if (data[i] === delimiter && isValue === false) {
      line[line.length] = safe(data, begin, i, isQuoted);
      isQuoted = false;
      begin = i + 1;
    } else if (data[i] === 13 && isValue === false) {
      line[line.length] = safe(data, begin, i, isQuoted);
      lines[lines.length] = line;
      line = [];
      isQuoted = false;
      begin = i + 2;
    }
  }

  line[line.length] = safe(data, begin, i, isQuoted);
  lines[lines.length] = line;

  return lines;
}

function detect(data) {
  data = data.slice(0, data.indexOf('\n'));

  let count = 0;
  let delimiter = null;
  let match = null;

  for (let i = 0; i < delimiters.length; i += 1) {
    match = data.match(new RegExp(delimiters[i]), 'g');
    delimiter = match && match.length > count ? delimiters[i] : delimiter;
    count = match && match.length > count ? match.length : count;
  }

  return delimiter;
}

function safe(data, begin, i, isQuoted) {
  const quote = (isQuoted ? 1 : 0);
  const value = data.slice(begin + quote, i - quote);
  return String(value).replace(/""/g, '"');
}
