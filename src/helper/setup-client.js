import chunked from '../chunked/codec';
import json from '../json/codec';
import msgpack from '../msgpack/codec';
import urlencoded from '../urlencoded/codec';

export default function setupClient(connector) {
  connector
    .find((w) => w.constructor.name === 'TransferEncodingDecoder')
    .manage(chunked.encoding, new chunked.Decoder());

  connector
    .find((w) => w.constructor.name === 'TransferEncodingEncoder')
    .manage(chunked.encoding, new chunked.Encoder());

  connector
    .find((w) => w.constructor.name === 'ContentTypeDecoder')
    .setStrict(false)
    .manage(json.type, new json.Decoder())
    .manage(msgpack.type, new msgpack.Decoder())
    .manage(urlencoded.type, new urlencoded.Decoder());

  connector
    .find((w) => w.constructor.name === 'ContentTypeEncoder')
    .setStrict(false)
    .manage(json.type, new json.Encoder())
    .manage(msgpack.type, new msgpack.Encoder())
    .manage(urlencoded.type, new urlencoded.Encoder());
}
