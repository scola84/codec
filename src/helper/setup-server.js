import chunked from '../chunked';
import formdata from '../formdata';
import html from '../html';
import json from '../json';
import msgpack from '../msgpack';
import urlencoded from '../urlencoded';

export default function setupServer([connector, ...workers], config = {}) {
  connector
    .find((w) => w.constructor.name === 'TransferEncodingDecoder')
    .manage(chunked.encoding, new chunked.Decoder());

  connector
    .find((w) => w.constructor.name === 'TransferEncodingEncoder')
    .manage(chunked.encoding, new chunked.Encoder());

  connector
    .find((w) => w.constructor.name === 'TransferEncodingHeader')
    .addEncoding(chunked.encoding);

  connector
    .find((w) => w.constructor.name === 'ContentTypeDecoder')
    .setStrict(false)
    .manage(html.type, new html.Decoder(config.html))
    .manage(json.type, new json.Decoder(config.json))
    .manage(msgpack.type, new msgpack.Decoder(config.msgpack))
    .manage(formdata.type, new formdata.Decoder(config.formdata))
    .manage(urlencoded.type, new urlencoded.Decoder(config.urlencoded));

  connector
    .find((w) => w.constructor.name === 'ContentTypeEncoder')
    .setStrict(false)
    .manage(html.type, new html.Encoder(config.html))
    .manage(json.type, new json.Encoder(config.json))
    .manage(msgpack.type, new msgpack.Encoder(config.msgpack))
    .manage(formdata.type, new formdata.Encoder(config.formdata))
    .manage(urlencoded.type, new urlencoded.Encoder(config.urlencoded));

  connector
    .find((w) => w.constructor.name === 'ContentTypeHeader')
    .addType(json.type)
    .addType(msgpack.type)
    .addType(formdata.type)
    .addType(urlencoded.type);

  return [connector, ...workers];
}
