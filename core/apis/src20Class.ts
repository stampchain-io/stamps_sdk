
const RESPONSE_LIMIT = 200;
const STAMPCHAIN_API_URL="https://stampchain.io/api/v2";

export class Src20Class {

  /**
   * Fetches SRC20 transactions by page.
   * @param {string} tick - The tick to filter by.
   * @param {number} limit - The number of transactions to fetch.
   * @param {number} page - The page number to fetch.
   * @returns {Promise} A promise that resolves to the fetched data.
   */
  static async fetch_src20_transactions_by_page(
    limit = RESPONSE_LIMIT,
    page = 1
  ) {
    const endpoint = `${STAMPCHAIN_API_URL}/src20?limit=${limit}&page=${page}`;
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const data = await response.json();
    return data
  }

  /**
   * Fetches the SRC20 balance for a given address and optionally a tick.
   * @param {string} address - The address to fetch the balance for.
   * @param {string|string[]} tick - The tick to filter by.
   * @returns {Promise} A promise that resolves to the fetched data.
   */
  static async fetch_src20_balance_for_address(
    address: string | null = null,
    tick: string | string[] | null = null,
  ) {
    const endpoint = tick ? `${STAMPCHAIN_API_URL}/src20/balance/${address}/${tick}` : `${STAMPCHAIN_API_URL}/src20/balance/${address}`;
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const data = await response.json();
    return data.filter(d => d.address === address);
  }
  
  /**
   * Fetches SRC20 transactions by tick and operation.
   * @param {string} tick - The tick to filter by.
   * @param {number} amt - The amount to filter by.
   * @param {number} limit - The number of transactions to fetch.
   * @param {number} page - The page number to fetch.
   * @param {string} op - The operation to filter by.
   * @param {string} sort - The sort order.
   * @returns {Promise} A promise that resolves to the fetched data.
   */
  static async fetch_src20_transactions_by_tick_and_op(
    tick: string,
    amt = 1,
    limit = RESPONSE_LIMIT,
    page = 0,
    op = 'DEPLOY',
    sort = 'DESC'
  ) {
    const endpoint = `${STAMPCHAIN_API_URL}/src20/tick?limit=${limit}&page=${page}&op=${op}&sort=${sort}`;
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const data = await response.json();
    return data.filter(item => item.tick === tick && item.amt >= amt);
  }

   /**
   * Fetches all SRC20 holders by tick.
   * @param {string} tick - The tick to filter by.
   * @param {number} amt - The amount to filter by.
   * @param {number} limit - The number of holders to fetch.
   * @param {number} page - The page number to fetch.
   * @returns {Promise} A promise that resolves to the fetched data.
   */
  static async fetch_all_src20_holders_by_tick(
    tick: string,
    amt = 0,
    limit = RESPONSE_LIMIT,
    page = 1
  ) {
    const endpoint = `${STAMPCHAIN_API_URL}/src20/balance/snapshot/${tick}?limit=${limit}&page=${page}`;
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const data = await response.json();
    return data.filter(item => item.amt > amt);
  }

  /**
   * Fetches the SRC20 minting progress by tick.
   * @param {string} tick - The tick to filter by.
   * @returns {Promise} A promise that resolves to the fetched data.
   */
  static async fetch_src20_minting_progress_by_tick(tick: string) {
    const endpoint = `${STAMPCHAIN_API_URL}/src20/tick/${tick}`;
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const data = await response.json();
    const mint_status = data.mint_status;

    const max_supply = mint_status.max_supply;  // use BigFloat to convert from string to number
    const total_minted = mint_status.total_minted;
    const total_mints = mint_status.total_mints;
    const progress = mint_status.progress;
    const decimals = mint_status.decimals;
    const limit = mint_status.limit;

    return {
      max_supply,
      total_minted,
      total_mints,
      progress,
      decimals,
      limit
    };
  }
}
