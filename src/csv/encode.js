const lineEndings = {
  CR: '\r',
  CRLF: '\r\n',
  LF: '\n'
};

export default function encode(options = {}, data) {
  const {
    delimiter = ',',
      fields = []
  } = options;

  let {
    lineEnding = 'LF'
  } = options;

  lineEnding = lineEndings[lineEnding];

  const regexp = new RegExp(`\r|\n|"|${delimiter}`);

  let csv = '';
  let field = null;

  for (let i = 0; i < fields.length; i += 1) {
    field = fields[i];
    csv += field.label && i > 0 ? delimiter : '';
    csv += field.label ? formatValue(field.label, delimiter, regexp) : '';
  }

  for (let i = 0; i < data.length; i += 1) {
    csv += csv.length > 0 ? lineEnding : '';

    for (let j = 0; j < fields.length; j += 1) {
      field = fields[j];
      csv += j > 0 ? delimiter : '';
      csv += formatValue(field.value(data[i]), delimiter, regexp);
    }
  }

  return csv;
}

function formatValue(value, delimiter, regexp) {
  value = String(value);
  return value.match(regexp) ? `"${value.replace(/"/g, '""')}"` : value;
}
