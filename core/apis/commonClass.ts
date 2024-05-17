// deno-lint-ignore-file no-explicit-any



const BTC_DATA_ENDPOINT_URL="https://mempool.space";
const STAMPCHAIN_API_URL="https://stampchain.io/api/v2";

export class CommonClass {

  /**
   * Retrieves the last block index from the database using the provided client.
   *
   * @returns A promise that resolves to the last block index.
   */
  static async get_current_block_height_from_btc() {
    return await fetch(`${BTC_DATA_ENDPOINT_URL}/api/blocks/tip/height`);
  }

  /**
   * Retrieves the last X blocks from the API. The hashes are used to validate the blocks 
   * amonst various indexer endpoints. 
   *
   * @param num - The number of blocks to retrieve. Defaults to 10.
   * @returns A promise that resolves to an array of blocks with additional hash information.
   */
  static async get_last_x_block_details_for_stamps(num = 10) {
    const blockInfo = await (await fetch(`${STAMPCHAIN_API_URL}/block/block_count/${num}`)).json();
    return blockInfo.map(block => ({
      id: block.block_index,
      timestamp: block.block_time,
      hash: block.block_hash,
      prevhash: block.previous_block_hash,
      ledger_hash: block.ledger_hash,
      txlist_hash: block.txlist_hash,
      messages_hash: block.messages_hash,
      tx_count: block.tx_count
    }));
  }
  

  /**
   * Retrieves stamp balances (including SRC-20 and Classic Stamps) for a given address.
   *
   * @param address - The address for which to retrieve stamp balances.
   * @returns An array of summarized stamp balances for the given address.
   */
  static async get_stamp_balances_by_address_with_client(address: string) {
    try {
      const response = await fetch(`${STAMPCHAIN_API_URL}/stamp/balance/${address}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const balance = await response.json();
      return balance;
    } catch (error) {
      console.error("Error getting balances: ", error);
      return [];
    }
}
}
