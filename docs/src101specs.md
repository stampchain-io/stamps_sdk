# SRC-101 Standard

`SRC-101` is a unique non-fungible token standard designed for the Bitcoin Name
Service, based on BTC Stamps. It is inherited from [SRC-20](./src20specs.md) and
maintains compatibility with it. In SRC-101, tokens are bound to owner accounts,
preventing them from being mistakenly spent with UTXOs, which safeguards the
assets from loss. Additionally, SRC-101 enables multiple transfer operations
within a single transaction, significantly reducing network fees.

# Specifications

A normal SRC-101 transaction must conform to these fields. Otherwise a Bitcoin
Stamp Number will not be created, the transaction will not be considered a valid
SRC-101 transaction and they will not appear in the Bitcoin Stamps Protocol
index / API.

### DEPLOY

```JSON
{
  "p": "src-101", //(string)protocol standard name for bitname service
  "root": "btc", //(string)root domain
  "op": "deploy", //(string)function name
  "name": "Bitname", //(string)collection name
  "lim": "10", //(uint64)A maximum of 10 mint op are allowed op in each transaction. If there are more than 10 mint op in 1 transaction, it's regarded as an invalid transction, all op will be failed.
  "owner": "bc1q34eaj4rz9yxupzxwza2epvt3qv2nvcc0ujqqpl", //(string)owner address
  "rec": [
  "bc1q7rwd4cgdvcmrxm27xfy6504jwkllge3dda04ww",
  "bc1q2xexmuqmf20u5yuqcyryqprgyvap9l2wqe3lh9",
  "bc1q7epcly9u55yut5k7ykmlcyrp87knt8gxd7knnt"
  ], //(string[])recipient address to receive mint fees, can include multi addresses in an array of string. Either will be valid in transaction verification. Pay mint fees to either of these is OK.
  "tick": "BNS", //(string)
  "pri": {0:45000,1:-1,2:-1,3:900000,4:225000}, //json object. The key is the length number of domain. These fee must be paid to "rec". Value is price in sats for each "idua". Allowed max count of this json key-value pair is 10. "-1" means it isn't mintable. 900000 is for 3 characters, 225000 is for 4 characters and 45000 is the default price for these unlisted legnth(>=5).
  "desc": "Bitname Service powered by BTC stamp.", //(string)description for the collection.
  "mintstart": "1706866958", // Unix timestamps in Milliseconds. Mint is available from this time.
  "mintend": "18446744073709551615", // Maximum Unix timestamps
  "wla": "03f86fde54dde75b1f63a5ecbf5bbf4ed5f83fee4f35437631ac605c04a8d5f15e", //Public key of admin address for whitelist data signature.
  "imglp":"https://img.bitname.pro/img/", //Image url link prefix.The full link should be "imglp"+"tokenid"(utf8)+"."+imgf"
  "imgf":"btc.png", //image format
  "idua": "999"//(string)"idua" is minimum duration. That means the actual duration = (Ceiling(dua/idua))*idua. The price will be (Ceiling(dua/idua))*pri.
}
```

The `DEPLOY` transaction signer must be the same as "owner", otherwise it will
not be considered as a valid SRC-101 transaction.

### MINT

```JSON
{
  "p": "src-101", //(string)protocol standard name
  "op": "mint", //(string)function name
  "hash": "38091b803f794e50dcc10a9091becaf4f65d35d3ef9e71cfa90c7936af50757e", //(hash256)txid of bns deploy transaction, without "0x" at the beginning
  "toaddress": "bc1q7rwd4cgdvcmrxm27xfy6504jwkllge3dda04ww", // owner address of this token, can be different from signer address.
  "tokenid": ["c3VwZXJib3k=", "ZGF5ZHJlYW0=", "Yml0aGVybw=="], // array of base64 string which allows multi tokenid mint in one op. (string)Base64 to UTF8: c3VwZXJib3k= -> superboy.
  "dua": "1", //(uint8)years of duration. Expire date = current expire date + dua
  "prim": "true", //This will allow setting current domain as a primary domain to bind with toaddress only if toaddress is signer address as well. You can setrecord to bind with another domain later as you wish. If you don't need this, just set it to false. If prim is true but toaddress is not signer address, prim will be set as false.
  "coef": "500", //The whitelist price in sats should be "coef" * "pri"/1000.For these not in whitelist, it should always be "".
  "sig": "1234...abcd", //It's used for a premissioned mint following whitelist.If not in whitelist or just want normal price, set it as "" 
  "img": ["https://img.bitname.pro/img/superboy.btc.png", "https://img.bitname.pro/img/daydream.btc.png","https://img.bitname.pro/img/bithero.btc.png"] //(optional)Image link to bind with token. It will be forced to convert to lower case. When "imglp" and "imgf" are set, it should be "imglp"+"tokenid"(utf8)+"."+"imgf". If "imglp" or "imgf" aren't set, it can be customized link.
}
```
`tokenid` is an array of base64 string. The allowed maximum count of items  is `lim`. This format is only for `mint` op. Maximum length of `tokenid` base64 string is 128.

`sig` is a script signed  by private key of `wla` . The unsigned content is a json object, must follow the format below:

If `dua` is not an integer multiple of `idua`, `dua` will be rounded up. For example: When `idua` is 20 and `dua` is 33, `dua` will be forced to set as 40.

In `MINT` transaction, vout[0] MUST be one of `rec` addresses, otherwise transaction is invalid.

```json
{
    "hash": "38091b803f794e50dcc10a9091becaf4f65d35d3ef9e71cfa90c7936af50757e",
    "coef": "500",
    "address": "bc1q7epcly9u55yut5k7ykmlcyrp87knt8gxd7knnt",
    "tokenid": ["c3VwZXJib3k=", "ZGF5ZHJlYW0=", "Yml0aGVybw=="],
    "dua": "3"
}
```
When `sig` is set in mint, the whitelist price in sats should be `coef`*`pri`/1000.  `sig` can be decrypted  by public key of `wla`. If it's failed, then this mint transaction is invalid.

`hash` in `sig` json must be the same as the `hash` in upper layer, otherwise transaction is invalid.

These parameters in `sig` json  must be the same as these ones in upper layer of mint method. Otherwise, this transaction verification will be failed.


### TRANSFER

```JSON
{
  "p": "src-101", //(string)protocol standard name
  "op": "transfer", //(string)function name
  "hash": "38091b803f794e50dcc10a9091becaf4f65d35d3ef9e71cfa90c7936af50757e", //(hash256)txid of the deploy transaction, without "0x" at the beginning. Only this txid will be considered as valid in bitname service.
  "toaddress": "bc1q7rwd4cgdvcmrxm27xfy6504jwkllge3dda04ww", // new owner address of this token..Support any existed type of bitcoin addresses
  "tokenid": "c3VwZXJib3k=" //(string)Base64 to UTF8: c3VwZXJib3k= -> superboy. It will be forced to convert to lower case.
}
```

If the Bitname domain specified to be transferred not in transaction sender's
address (which would be determined by the latest state of an Indexer), then the
transfer will be deemed invalid.

### SETRECORD

```JSON
{
  "p": "src-101", //(string)protocol standard name
  "op": "setrecord", //(string)function name
  "hash": "38091b803f794e50dcc10a9091becaf4f65d35d3ef9e71cfa90c7936af50757e", //(hash256)txid of the deploy transaction, without "0x" at the beginning
  "tokenid": "c3VwZXJib3k=", //(string)Base64 to UTF8: c3VwZXJib3k= -> superboy.Maximum length of `tokenid` base64 string is 128.It will be forced to convert to lower case.
  "type": "address", //(string)Currently two kinds of record types are supported, txt and address
  "data":{
  "btc": "bc1q7epcly9u55yut5k7ykmlcyrp87knt8gxd7knnt",
  "eth": "7748baa6434fd17e4901e2049acad30fac188398e235e92efcd9ab90dfd67c602b4c6a50f0f62a6d3fa6d6a46abe6c1ae141f8f3322b7266fe9611a029dd7a971c"
  },//(Object of string value, can include multi key-value pairs)record data, this is an example to bind with both btc and eth address.
  "prim": "true" //"true" makes this btc domain as a primary one to bind with this address.It can be true only when "btc" address is set in "data". If you don't need this, make it as "false".
}
```

```JSON
{
  "p": "src-101", //(string)protocol standard name
  "op": "setrecord", //(string)function name
  "hash": "38091b803f794e50dcc10a9091becaf4f65d35d3ef9e71cfa90c7936af50757e", //(hash256)txid of the deploy transaction, without "0x" at the beginning
  "tokenid": "c3VwZXJib3k=", //(string)Base64 to UTF8: c3VwZXJib3k= -> superboy.Maximum length of `tokenid` base64 string is 128. It will be forced to convert to lower case.
  "type": "address", //(string)Currently two kinds of record types are supported: txt and address
  "data":{
  "btc": "bc1q7epcly9u55yut5k7ykmlcyrp87knt8gxd7knnt"
  },//(Object of string value, can include multi key-value pairs)record data,  this is an example to bind with btc address and set eth address as null. 
  "prim": "true" //"true" makes this btc domain as a primary one to bind with this address.It can be true only when "btc" address is set in "data". If you don't need this, make it as "false".
}
```

```JSON
{
  "p": "src-101", //(string)protocol standard name
  "op": "setrecord", //(string)function name
  "hash": "38091b803f794e50dcc10a9091becaf4f65d35d3ef9e71cfa90c7936af50757e", //(hash256)txid of the deploy transaction, without "0x" at the beginning
  "tokenid": "c3VwZXJib3k=", //(string)Base64 to UTF8: c3VwZXJib3k= -> superboy.Maximum length of `tokenid` base64 string is 128. It will be forced to convert to lower case.
  "type": "address", //(string)Currently two kinds of record types are supported: txt and address
  "data":{
  "eth": "7748baa6434fd17e4901e2049acad30fac188398e235e92efcd9ab90dfd67c602b4c6a50f0f62a6d3fa6d6a46abe6c1ae141f8f3322b7266fe9611a029dd7a971c"
  },//(Object of string value, can include multi key-value pairs)record data,  this is an example to bind with eth address and set btc address as null. 
  "prim": "false" //"true" makes this btc domain as a primary one to bind with this address.It can be true only when "btc" address is set in "data". If you don't need this, make it as "false".
}
```

```JSON
{
  "p": "src-101", //(string)protocol standard name
  "op": "setrecord", //(string)function name
  "hash": "38091b803f794e50dcc10a9091becaf4f65d35d3ef9e71cfa90c7936af50757e", //(hash256)txid of the deploy transaction, without "0x" at the beginning
  "tokenid": "c3VwZXJib3k=", //(string)Base64 to UTF8: c3VwZXJib3k= -> superboy. It will be forced to convert to lower case.
  "type": "txt", //(string)Currently two kinds of record types are supported: txt and address
  "data":
  {
  "twitter": "BitnameService",
  "github": "stampchain-io",
  "telegram": "BitcoinStamps"
  },//(Object of string value, can include multi key-value pairs)record data 
  "prim": "false" //"true" makes this btc domain as a primary one to bind with this address.It can be true only when "btc" address is set in "data". If you don't need this, make it as "false".
}
```

The `SETRECORD` transaction signer must be the same as "owner", otherwise it
will not be considered as a valid SRC-101 transaction. 

`data` is a Json object of string value, it can include multi key-value pairs. 

When `type` is "address", `data` MUST include address type. Currently we only support `btc`and `eth` address types and only can set single value as record under each address type. For `btc`,  the value MUST be a valid btc address. For `eth`, the value MUST be a result of signed msg following [EIP191](https://eips.ethereum.org/EIPS/eip-191). The message to sign is the input UTXO hash for `setrecord` transaction. For example:
```
UTXO: 3409229f61face039da6bfc947252f506f379e41e3ef4a7d0cf9006b0afce695
UTXO as Message to keccak256: d7f2304806700771ad69624987a51c1c0dc2ee7884fe75428bc3e02cb6921070
Then sign it with aimed eth address: 7748baa6434fd17e4901e2049acad30fac188398e235e92efcd9ab90dfd67c602b4c6a50f0f62a6d3fa6d6a46abe6c1ae141f8f3322b7266fe9611a029dd7a971c
Signer address can be recovered by keccak256 message hash and signature:
2CA7447310b9588D9112Ee68D83dAeD4D17e5719
```

If you set a new address record in the same address type, the previous will be overwritten. If you set a single address record, it will only update the record under this address.

If `prim` is true and `type` is not "txt", `prim` will not work. If `prim` is true, `type` is "address" and `data` is not including `btc` address,  `prim` will not work as well.

When `type` is "txt", `data` can be any you'd like to set. Some key words like "twitter", "github" and "telegram" may be picked as user info by Bitname Service.

### RENEW

```JSON
{
  "p": "src-101", //(string)protocol standard for non-fungible token
  "op": "renew", //(string)function name
  "hash": "38091b803f794e50dcc10a9091becaf4f65d35d3ef9e71cfa90c7936af50757e", //(hash256)txid of the deploy transaction
  "tokenid": "c3VwZXJib3k=", //(string)Base64 to UTF8: c3VwZXJib3k= -> superboy. Maximum length of `tokenid` base64 string is 128. It will be forced to convert to lower case.
  "dua": "2" //(uint8)years of duration. Expire date = current expire date + dua
}
```

In `RENEW` transaction, vout[0] MUST be one of `rec` addresses, otherwise transaction is invalid.

# SRC-101 Token Requirements

1. For root, name and UTF8 tokenid, these are disallowed characters: /[`~!@#$%^\-+&*()_==＝|{}":;',\\\[\]\.·<>\/?~！@#￥……&*（）——|{}【】《》'；：“”‘。，、？\s]/
2. Some special **Whitespace_character** are also disallowed, here is the unicode list:
`["\u0009","\u000A","\u000B","\u000C","\u000D","\u0020","\u0085","\u00A0","\u1680","\u2000","\u2001","\u2002","\u2003","\u2004","\u2005","\u2006","\u2007","\u2008","\u2009","\u200A","\u2028","\u2029","\u202F","\u205F","\u3000","\u180E","\u200B","\u200C","\u200D","\u2060","\uFEFF"]`
