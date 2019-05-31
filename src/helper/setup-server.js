import {
  chunked,
  formdata,
  html,
  json,
  msgpack,
  urlencoded,
  plain
} from '../worker';

export default function setupServer(workers, config = {}) {
  const {
    connector,
    responder
  } = workers;

  connector
    .find((w) => w.constructor.name === 'TransferEncodingDecoder')
    .manage(chunked.encoding, new chunked.Decoder());

  connector
    .find((w) => w.constructor.name === 'ContentTypeDecoder')
    .setStrict(false)
    .manage(html.type, new html.Decoder(config.html))
    .manage(json.type, new json.Decoder(config.json))
    .manage(msgpack.type, new msgpack.Decoder(config.msgpack))
    .manage(formdata.type, new formdata.Decoder(config.formdata))
    .manage(urlencoded.type, new urlencoded.Decoder(config.urlencoded))
    .manage(plain.type, new plain.Decoder(config.plain));

  responder
    .find((w) => w.constructor.name === 'TransferEncodingEncoder')
    .manage(chunked.encoding, new chunked.Encoder());

  responder
    .find((w) => w.constructor.name === 'TransferEncodingHeader')
    .addEncoding(chunked.encoding);

  responder
    .find((w) => w.constructor.name === 'ContentTypeEncoder')
    .setStrict(false)
    .manage(html.type, new html.Encoder(config.html))
    .manage(json.type, new json.Encoder(config.json))
    .manage(msgpack.type, new msgpack.Encoder(config.msgpack))
    .manage(formdata.type, new formdata.Encoder(config.formdata))
    .manage(urlencoded.type, new urlencoded.Encoder(config.urlencoded))
    .manage(plain.type, new plain.Encoder(config.plain));

  responder
    .find((w) => w.constructor.name === 'ContentTypeHeader')
    .addType(json.type)
    .addType(msgpack.type)
    .addType(formdata.type)
    .addType(urlencoded.type)
    .addType(plain.type);

  return workers;
}
