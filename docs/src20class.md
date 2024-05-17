# Bitcoin Stamps SRC20 [src20Class](./core/apis/src20Class.ts) SDK Documentation

## Overview

This SDK provides functions to interact with the StampChain API for managing and
retrieving SRC20 token data. It supports fetching SRC20 transactions, balances,
holders, and minting progress.

## Constants

- `RESPONSE_LIMIT`: The default limit for fetching SRC20 data (set to 200).
- `STAMPCHAIN_API_URL`: The base URL for the StampChain API
  (`https://stampchain.io/api/v2`).

## Class: Src20Class

### Method: `fetch_src20_transactions_by_page`

Fetches SRC20 transactions by page.

#### Parameters

- `limit`: The number of transactions to fetch. Defaults to `RESPONSE_LIMIT`.
- `page`: The page number to fetch. Defaults to 1.

#### Returns

- `Promise<Object>`: The fetched data.

#### Example

```javascript
const transactions = await Src20Class.fetch_src20_transactions_by_page(100, 2);
```

### Method: `fetch_src20_balance_for_address`

Fetches the SRC20 balance for a given address and optionally a tick.

#### Parameters

- `address`: The address to fetch the balance for.
- `tick`: The tick to filter by.

#### Returns

- `Promise<Object[]>`: The fetched data.

#### Example

```javascript
const balance = await Src20Class.fetch_src20_balance_for_address(
  "your-address",
  "your-tick",
);
```

### Method: `fetch_src20_transactions_by_tick_and_op`

Fetches SRC20 transactions by tick and operation.

#### Parameters

- `tick`: The tick to filter by.
- `amt`: The amount to filter by. Defaults to 1.
- `limit`: The number of transactions to fetch. Defaults to `RESPONSE_LIMIT`.
- `page`: The page number to fetch. Defaults to 0.
- `op`: The operation to filter by. Defaults to 'DEPLOY'.
- `sort`: The sort order. Defaults to 'DESC'.

#### Returns

- `Promise<Object[]>`: The fetched data.

#### Example

```javascript
const transactions = await Src20Class.fetch_src20_transactions_by_tick_and_op(
  "your-tick",
  10,
  100,
  1,
  "TRANSFER",
  "ASC",
);
```

### Method: `fetch_all_src20_holders_by_tick`

Fetches all SRC20 holders by tick.

#### Parameters

- `tick`: The tick to filter by.
- `amt`: The amount to filter by. Defaults to 0.
- `limit`: The number of holders to fetch. Defaults to `RESPONSE_LIMIT`.
- `page`: The page number to fetch. Defaults to 1.

#### Returns

- `Promise<Object[]>`: The fetched data.

#### Example

```javascript
const holders = await Src20Class.fetch_all_src20_holders_by_tick(
  "your-tick",
  10,
  100,
  1,
);
```

### Method: `fetch_src20_minting_progress_by_tick`

Fetches the SRC20 minting progress by tick.

#### Parameters

- `tick`: The tick to filter by.

#### Returns

- `Promise<Object>`: The fetched data, including max supply, total minted, total
  mints, progress, decimals, and limit.

#### Example

```javascript
const progress = await Src20Class.fetch_src20_minting_progress_by_tick(
  "your-tick",
);
```
