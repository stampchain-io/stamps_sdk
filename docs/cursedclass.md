# Bitcoin Stamps Cursed Stamps [CursedClass](./core/apis/cursedClass.ts) SDK Documentation

## Overview

This SDK provides functions to interact with the StampChain API for managing and
retrieving cursed stamps data. It supports fetching cursed stamps by page and
block index. The [StampsClass](./docs/stampsClass.md) can be used to fetch
individual cursed stamps using their negative stamp number, tx_hash, or
stamp_hash

## Import

```javascript
import { PROTOCOL_IDENTIFIERS as SUBPROTOCOLS } from "../utils/protocol.ts";
```

## Constants

- `RESPONSE_LIMIT`: The default limit for fetching cursed stamps (set to 200).
- `STAMPCHAIN_API_URL`: The base URL for the StampChain API
  (`https://stampchain.io/api/v2`).

## Class: CursedClass

### Method: `fetch_cursed_stamps_by_page`

Fetches a specific page of cursed stamps from the API. Can be used with
pagination.

#### Parameters

- `limit`: The number of stamps to fetch per page. Defaults to `RESPONSE_LIMIT`.
- `page`: The page number to fetch. Defaults to 1.
- `sort_order`: The order in which to sort the stamps. Can be 'asc' or 'desc'.
  Defaults to 'asc'.

#### Returns

- `Promise<Object>`: An object containing the fetched page of cursed stamps.

#### Example

```javascript
const stampsPage = await CursedClass.fetch_cursed_stamps_by_page(
  100,
  2,
  "desc",
);
```

### Method: `get_cursed_stamps_by_block_index`

Fetches cursed stamps by block index from the API.

#### Parameters

- `block_index`: The block index for which to fetch the cursed stamps.

#### Returns

- `Promise<Object>`: The data returned by the API. This includes information
  about the cursed stamps for the given block index.

#### Example

```javascript
const cursedStampsData = await CursedClass.get_cursed_stamps_by_block_index(
  830000,
);
```
