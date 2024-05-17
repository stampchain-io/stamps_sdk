# Bitcoin Stamps [QuickNode](./utils/quicknode.ts) SDK Documentation

## Overview

This SDK provides functions to interact with the QuickNode API for managing and
retrieving blockchain data. It supports fetching data such as public keys, raw
transactions, and decoded transactions. This is a reference only, please refer
to Quicknode for further details and examples.

## Constants

- `MAX_API_RETRIES`: The maximum number of retries for API calls (set to 3).
- `QUICKNODE_ENDPOINT`: The base endpoint for the QuickNode API.
- `QUICKNODE_API_KEY`: The API key for accessing the QuickNode API.
- `QUICKNODE_URL`: The complete URL for the QuickNode API
  (`${QUICKNODE_ENDPOINT}/${QUICKNODE_API_KEY}`).

## Function: `fetch_quicknode`

Fetches data from the QuickNode API with the specified method and parameters.

### Parameters

- `method`: The API method to call.
- `params`: The parameters to pass to the API method.
- `retries`: The number of retries attempted. Defaults to 0.

### Returns

- `Promise<Object | null>`: The result of the API call.

### Example

```javascript
const result = await fetch_quicknode("getblockcount", []);
```

## Function: `get_public_key_from_address`

Fetches the public key from the address using the QuickNode API.

### Parameters

- `address`: The address for which to fetch the public key.

### Returns

- `Promise<string>`: The public key associated with the address.

### Example

```javascript
const publicKey = await get_public_key_from_address("your-address");
```

## Function: `get_raw_tx`

Fetches the raw transaction data from the QuickNode API.

### Parameters

- `txHash`: The hash of the transaction to fetch.

### Returns

- `Promise<string>`: The raw transaction data.

### Example

```javascript
const rawTx = await get_raw_tx("your-txHash");
```

## Function: `get_decoded_tx`

Fetches the decoded transaction data from the QuickNode API.

### Parameters

- `txHex`: The hex string of the transaction to decode.

### Returns

- `Promise<Object>`: The decoded transaction data.

### Example

```javascript
const decodedTx = await get_decoded_tx("your-txHex");
```

## Function: `get_transaction`

Fetches and decodes the transaction data from the QuickNode API.

### Parameters

- `txHash`: The hash of the transaction to fetch and decode.

### Returns

- `Promise<Object>`: The combined transaction data, including the hex and
  decoded information.

### Example

```javascript
const txData = await get_transaction("your-txHash");
```
