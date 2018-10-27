export default function encode({ delimiter = ',', fields = [] }, data) {
  const regexp = new RegExp(`\n|"|${delimiter}`);

  let csv = '';
  let field = null;

  for (let i = 0; i < fields.length; i += 1) {
    field = fields[i];
    csv += field.label && i > 0 ? delimiter : '';
    csv += field.label ? safe(field.label, delimiter, regexp) : '';
  }

  for (let i = 0; i < data.length; i += 1) {
    csv += csv.length > 0 ? '\r\n' : '';

    for (let j = 0; j < fields.length; j += 1) {
      field = fields[j];
      csv += j > 0 ? delimiter : '';
      csv += safe(field.value(data[i]), delimiter, regexp);
    }
  }

  return csv;
}

function safe(value, delimiter, regexp) {
  value = String(value);
  return value.match(regexp) ? `"${value.replace(/"/g, '""')}"` : value;
}
