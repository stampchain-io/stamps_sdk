# Bitcoin Stamps [StampsClass](./core/apis/stampsClass.ts) SDK Documentation

## Overview

This SDK provides functions to interact with the StampChain API for managing and
retrieving Bitcoin Stamps data. It supports fetching stamps by various criteria
such as total count, page, block index, subprotocol, and specific identifiers.
Please refer to https://stampchain.io/docs for more information on the
StampChain API.

## Import

```javascript
import { PROTOCOL_IDENTIFIERS as SUBPROTOCOLS } from "utils/protocol.ts";
```

## Constants

- `RESPONSE_LIMIT`: The default limit per page for fetching stamps
- `STAMPCHAIN_API_URL`: The base URL for the StampChain API
  (`https://stampchain.io/api/v2`).

## StampsClass Methods

### Method: `fetch_count_of_total_stamps`

Fetches the total count of stamps and the last block index from the API.

#### Returns

- `Promise<{ total: number, lastBlock: number }>`: An object containing the
  total count of stamps and the last block index.

#### Example

```javascript
const { total, lastBlock } = await StampsClass.fetch_count_of_total_stamps();
```

### Method: `fetch_stamps_by_page`

Fetches a specific page of stamps from the API. Can be used with pagination.

#### Parameters

- `limit`: The number of stamps to fetch per page. Defaults to `RESPONSE_LIMIT`.
- `page`: The page number to fetch. Defaults to 1.
- `sort_order`: The order in which to sort the stamps. Can be 'asc' or 'desc'.
  Defaults to 'asc'.

#### Returns

- `Promise<Object>`: An object containing the fetched page of stamps.

#### Example

```javascript
const stampsPage = await StampsClass.fetch_stamps_by_page(100, 2, "desc");
```

### Method: `fetch_stamps_by_block_index`

Fetches stamps by block index from the API.

#### Parameters

- `block_index`: The block index for which to fetch the stamps.

#### Returns

- `Promise<Object>`: The data returned by the API. This includes information
  about the last block, the block info, and an array of data for each stamp in
  the block.

#### Example

```javascript
const stampsData = await StampsClass.fetch_stamps_by_block_index(830000);
```

### Method: `fetch_stamps_by_subprotocol`

Fetches stamps by subprotocol from the API.

#### Parameters

- `ident`: The subprotocol for which to fetch the stamps. This should be one of
  the values defined in the `SUBPROTOCOLS` object.
- `limit`: The maximum number of stamps to fetch. Defaults to 100.
- `page`: The page number to fetch. Defaults to 1.

#### Returns

- `Promise<Object>`: The data returned by the API. This includes information
  about the page, limit, total pages, total stamps, last block, ident, and an
  array of data for each stamp.

#### Example

```javascript
const stampsData = await StampsClass.fetch_stamps_by_subprotocol(
  SUBPROTOCOLS.STAMP,
  100,
  1,
);
```

### Method: `fetch_stamp_by_identifier`

Fetches a single stamp by its identifier from the API.

#### Parameters

- `identifier`: The identifier for which to fetch the stamp. This should be one
  of [tx_hash, stamp, cpid, or stamp_hash].

#### Returns

- `Promise<Object>`: The data returned by the API. This includes information
  about the last block and the stamp data.

#### Example

```javascript
const stampData = await StampsClass.fetch_stamp_by_identifier("23");
```
