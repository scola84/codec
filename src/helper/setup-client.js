import {
  chunked,
  formdata,
  html,
  json,
  msgpack,
  urlencoded,
  plain
} from '../worker';

export function setupClient(workers, config = {}) {
  const {
    connector
  } = workers;

  connector
    .find((w) => w.constructor.name === 'TransferEncodingDecoder')
    .manage(chunked.encoding, new chunked.Decoder());

  connector
    .find((w) => w.constructor.name === 'TransferEncodingEncoder')
    .manage(chunked.encoding, new chunked.Encoder());

  connector
    .find((w) => w.constructor.name === 'ContentTypeDecoder')
    .setStrict(false)
    .manage(html.type, new html.Decoder(config.html))
    .manage(json.type, new json.Decoder(config.json))
    .manage(msgpack.type, new msgpack.Decoder(config.msgpack))
    .manage(urlencoded.type, new urlencoded.Decoder(config.urlencoded))
    .manage(plain.type, new plain.Decoder(config.plain));

  connector
    .find((w) => w.constructor.name === 'ContentTypeEncoder')
    .setStrict(false)
    .manage(html.type, new html.Encoder(config.html))
    .manage(json.type, new json.Encoder(config.json))
    .manage(msgpack.type, new msgpack.Encoder(config.msgpack))
    .manage(formdata.type, new formdata.Encoder(config.formdata))
    .manage(urlencoded.type, new urlencoded.Encoder(config.urlencoded))
    .manage(plain.type, new plain.Encoder(config.plain));

  return workers;
}
