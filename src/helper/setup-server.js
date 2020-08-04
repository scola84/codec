import chunked from '../chunked';
import formdata from '../formdata';
import html from '../html';
import json from '../json';
import msgpack from '../msgpack';
import octetStream from '../octet-stream';
import urlencoded from '../urlencoded';
import plain from '../urlencoded';

export default function setupServer(workers, config = {}) {
  const [
    serverConnector, ,
    errorResponder
  ] = workers;

  serverConnector
    .find((w) => w.constructor.name === 'TransferEncodingDecoder')
    .manage(chunked.encoding, new chunked.Decoder());

  serverConnector
    .find((w) => w.constructor.name === 'ContentTypeDecoder')
    .setStrict(false)
    .manage(html.type, new html.Decoder(config.html))
    .manage(json.type, new json.Decoder(config.json))
    .manage(msgpack.type, new msgpack.Decoder(config.msgpack))
    .manage(formdata.type, new formdata.Decoder(config.formdata))
    .manage(octetStream.type, new octetStream.Decoder(config.octetStream))
    .manage(urlencoded.type, new urlencoded.Decoder(config.urlencoded))
    .manage(plain.type, new plain.Decoder(config.plain));

  errorResponder
    .find((w) => w.constructor.name === 'TransferEncodingEncoder')
    .manage(chunked.encoding, new chunked.Encoder());

  errorResponder
    .find((w) => w.constructor.name === 'TransferEncodingHeader')
    .addEncoding(chunked.encoding);

  errorResponder
    .find((w) => w.constructor.name === 'ContentTypeEncoder')
    .setStrict(false)
    .manage(html.type, new html.Encoder(config.html))
    .manage(json.type, new json.Encoder(config.json))
    .manage(msgpack.type, new msgpack.Encoder(config.msgpack))
    .manage(formdata.type, new formdata.Encoder(config.formdata))
    .manage(octetStream.type, new octetStream.Encoder(config.octetStream))
    .manage(urlencoded.type, new urlencoded.Encoder(config.urlencoded))
    .manage(plain.type, new plain.Encoder(config.plain));

  errorResponder
    .find((w) => w.constructor.name === 'ContentTypeHeader')
    .addType(json.type)
    .addType(msgpack.type)
    .addType(formdata.type)
    .addType(octetStream.type)
    .addType(urlencoded.type)
    .addType(plain.type);

  return workers;
}
