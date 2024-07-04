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
  "name": "Bit Name Service", //(string)collection name
  "lim": "10", //(uint64)A maximum of 10 mint op are allowed op in each transaction. If there are more than 10 mint op in 1 transaction, it's regarded as an invalid transction, all op will be failed.
  "owner": "bc1q34eaj4rz9yxupzxwza2epvt3qv2nvcc0ujqqpl", //(string)owner address
  "rec": [
  "bc1q7rwd4cgdvcmrxm27xfy6504jwkllge3dda04ww",
  "bc1q2xexmuqmf20u5yuqcyryqprgyvap9l2wqe3lh9",
  "bc1q7epcly9u55yut5k7ykmlcyrp87knt8gxd7knnt"
  ], //(string[])recipient address to receive mint fees, can include multi addresses in an array of string. Either will be valid in transaction verification. Pay mint fees to either of these is OK.
  "tick": "BNS", //(string)
  "pri": "900000, 225000, 45000", //(uint64)price in sats, must pay to "rec". 900000 is for 3 characters, 225000 is for 4 characters and 45000 is for >= 5 characters.
  "desc": "Bitname Service powered by BTC stamp.", //(string)description for the collection.
  "mintstart": "1706866958", // Unix timestamps in Milliseconds. Mint is available from this time.
  "mintend": "18446744073709551615", // Maximum Unix timestamps
  "wll": "https://xxxxx.csv" // whitelist csv link, discount amount and addresses must be included.
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
  "tokenid": ["c3VwZXJib3k=", "ZGF5ZHJlYW0=", "Yml0aGVybw=="], // array of base64 string which allows multi tokenid mint in one op
  "dua": "1", //(uint8)years of duration. Expire date = current expire date + dua
  "prim": "true" //This will allow setting current owner address as a primary address to bind with this domain. You can setrecord to another address later as you wish. If you don't need this, just set it to false.
}
```
`tokenid` is an array of base64 string. The allowed maximum count of items  is `lim`. This format is only for `mint` op.

### TRANSFER

```JSON
{
  "p": "src-101", //(string)protocol standard name
  "op": "transfer", //(string)function name
  "hash": "38091b803f794e50dcc10a9091becaf4f65d35d3ef9e71cfa90c7936af50757e", //(hash256)txid of the deploy transaction, without "0x" at the beginning. Only this txid will be considered as valid in bitname service.
  "toaddress": "bc1q7rwd4cgdvcmrxm27xfy6504jwkllge3dda04ww", // new owner address of this token..Support any existed type of bitcoin addresses
  "tokenid": "c3VwZXJib3k=" //(string)Base64 to UTF8: c3VwZXJib3k= -> superboy.
}
```

If the bitname domain specified to be transferred not in transaction sender's
address (which would be determined by the latest state of an Indexer), then the
transfer will be deemed invalid.

### SETRECORD

```JSON
{
  "p": "src-101", //(string)protocol standard name
  "op": "setrecord", //(string)function name
  "hash": "38091b803f794e50dcc10a9091becaf4f65d35d3ef9e71cfa90c7936af50757e", //(hash256)txid of the deploy transaction, without "0x" at the beginning
  "tokenid": "c3VwZXJib3k=", //(string)Base64 to UTF8: c3VwZXJib3k= -> superboy.
  "type": "address", //(string)Currently two kinds of record types are supported, txt and address
  "data":{
  "btc": "bc1q7epcly9u55yut5k7ykmlcyrp87knt8gxd7knnt"
  },//(Object of string value, can include multi key-value pairs)record data, this is an example to bind with btc address.
  "prim":"true" //"true" makes address as a primary address to bind with this domain.If you don't need this, make it as "false".
}
```

```JSON
{
  "p": "src-101", //(string)protocol standard name
  "op": "setrecord", //(string)function name
  "hash": "38091b803f794e50dcc10a9091becaf4f65d35d3ef9e71cfa90c7936af50757e", //(hash256)txid of the deploy transaction, without "0x" at the beginning
  "tokenid": "c3VwZXJib3k=", //(string)Base64 to UTF8: c3VwZXJib3k= -> superboy.
  "type": "address", //(string)Currently two kinds of record types are supported: txt and address
  "data":{
  "eth": "93cFac8715c80979f30Da024Ce9Ed4acD5A0631b"
  },//(Object of string value, can include multi key-value pairs)record data,  this is an example to bind with eth address. 
  "prim":"true" //"true" makes address as a primary address to bind with this domain.If you don't need this, make it as "false".
}
```

```JSON
{
  "p": "src-101", //(string)protocol standard name
  "op": "setrecord", //(string)function name
  "hash": "38091b803f794e50dcc10a9091becaf4f65d35d3ef9e71cfa90c7936af50757e", //(hash256)txid of the deploy transaction, without "0x" at the beginning
  "tokenid": "c3VwZXJib3k=", //(string)Base64 to UTF8: c3VwZXJib3k= -> superboy.
  "type": "txt", //(string)Currently two kinds of record types are supported: txt and address
  "data":
  {
  "twitter": "BitnameService",
  "github": "stampchain-io",
  "telegram": "BitcoinStamps"
  },//(Object of string value, can include multi key-value pairs)record data 
  "prim":"false" //"true" makes address as a primary address to bind with this domain.If you don't need this, make it as "false".
}
```

The `SETRECORD` transaction signer must be the same as "owner", otherwise it
will not be considered as a valid SRC-101 transaction. Multi record could exist
for different addresses. If the record for setting is existed, it will be
overwrote.

`data` is a Json object of string value, it can include multi key-value pairs. 

When `type` is "address", `data` MUST include two string parameters. The first is address type. Currently we only support `btc`and `eth` address type. The second is address value.

When `type` is "txt", `data` can be any you'd like to set. 

### RENEW

```JSON
{
  "p": "src-101", //(string)protocol standard for non-fungible token
  "op": "renew", //(string)function name
  "hash": "38091b803f794e50dcc10a9091becaf4f65d35d3ef9e71cfa90c7936af50757e", //(hash256)txid of the deploy transaction
  "tokenid": "c3VwZXJib3k=", //(string)Base64 to UTF8: c3VwZXJib3k= -> superboy.
  "dua": "2" //(uint8)years of duration. Expire date = current expire date + dua
}
```

### TRANSFEROWNERSHIP

```JSON
{
  "p": "src-101", //(string)protocol standard for non-fungible token
  "op": "transferownership", //(string)function name
  "hash": "38091b803f794e50dcc10a9091becaf4f65d35d3ef9e71cfa90c7936af50757e", //(hash256)txid of the deploy transaction
  "newowner": "bc1qag3cemd7988sgtx2huscdf6qmvgexnsx393ayc" //(string)new owner address. Support existed 4 types of bitcoin addresses
}
```

This allows SRC-101 admin transferring ownership to another. The
`TRANSFEROWNERSHIP` transaction signer must be the same as "owner", otherwise it
will not be considered as a valid SRC-101 transaction.
