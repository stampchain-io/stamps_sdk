import { PROTOCOL_IDENTIFIERS as SUBPROTOCOLS } from "../utils/protocol.ts";

const RESPONSE_LIMIT=1000;
const STAMPCHAIN_API_URL="https://stampchain.io/api/v2";

export class StampsClass {

  /**
   * Fetches the total count of stamps and the last block index from the API.
   *
   * This function retrieves the total count of stamps and the last block indexed by the endpoint.
   *
   * @returns A promise that resolves to an object containing the total count of stamps and the last block index.
   *
   * @example
   * const { total, lastBlock } = await StampsClass.fetch_count_of_total_stamps();
   */
  static async fetch_count_of_total_stamps() {
    const response = await fetch(`${STAMPCHAIN_API_URL}/stamps?limit=1&page=1`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    const data = await response.json();
    return {
      total: data.total,
      lastBlock: data.last_block
    };
  }

  /**
   * Fetches a specific page of stamps from the API. Can be used with pagination.
   *
   * This function fetches a page of stamps from the API, with a specified limit and sort order.
   *
   * @param limit - The number of stamps to fetch per page. Defaults to RESPONSE_LIMIT.
   * @param page - The page number to fetch. Defaults to 1.
   * @param sort_order - The order in which to sort the stamps. Can be 'asc' or 'desc'. Defaults to 'asc'.
   * @returns A promise that resolves to an object containing the fetched page of stamps.
   *
   * @example
   * const stampsPage = await StampsClass.fetch_stamps_by_page(100, 2, 'desc');
   */
  static async fetch_stamps_by_page(
    limit = RESPONSE_LIMIT,
    page = 1,
    sort_order: "asc" | "desc" = "asc",
    ) {
      const order = sort_order.toUpperCase() === "ASC" ? "asc" : "desc";
      const response = await fetch(`${STAMPCHAIN_API_URL}/stamps?limit=${limit}&page=${page}&sort_order=${order}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const data = await response.json();
      return data;
    }

    /**
     * Fetches stamps by block index from the API.
     *
     * This function retrieves the stamps associated with the specified block index. 
     *
     * @param block_index - The block index for which to fetch the stamps.
     * @returns A promise that resolves to the data returned by the API. This includes information about the last block, the block info, and an array of data for each stamp in the block.
     *
     * @example
     * const stampsData = await StampsClass.fetch_stamps_by_block_index_with_client(830000);
     */
    static async fetch_stamps_by_block_index(block_index: number) {
      const response = await fetch(`${STAMPCHAIN_API_URL}/stamps/block/${block_index}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      return data;
    }

    /**
     * Fetches stamps by subprotocol from the API.
     *
     * This function retrieves the stamps associated with the specified subprotocol. ['STAMP', 'SRC-20', 'SRC-721']
     *
     * @param ident - The subprotocol for which to fetch the stamps. This should be one of the values defined in the SUBPROTOCOLS object.
     * @param limit - The maximum number of stamps to fetch. Defaults to 100.
     * @param page - The page number to fetch. Defaults to 1.
     * @returns A promise that resolves to the data returned by the API. This includes information about the page, limit, total pages, total stamps, last block, ident, and an array of data for each stamp.
     *
     * @example
     * const stampsData = await StampsClass.fetch_stamps_by_subprotocol(SUBPROTOCOLS.STAMP, 100, 1);
     */
    static async fetch_stamps_by_subprotocol(ident: typeof SUBPROTOCOLS, limit = 100, page = 1) {
      const response = await fetch(`${STAMPCHAIN_API_URL}/stamps/ident/${ident}?limit=${limit}&page=${page}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      return data;
    }

  /**
   * Fetches a single stamp by its identifier from the API.
   *
   * This function sends a GET request to the API endpoint and retrieves the stamp associated with the specified identifier.
   * The identifier can be one of the following types: tx_hash, stamp, cpid, stamp_hash.
   *
   * @param identifier - The identifier for which to fetch the stamp. This should be one of [ tx_hash, stamp, cpid, or stamp_hash ].
   * @returns A promise that resolves to the data returned by the API. This includes information about the last block and the stamp data.
   *
   * @example
   * const stampData = await StampsClass.fetch_stamp_by_identifier('23');
   */
  static async fetch_stamp_by_identifier(identifier: string) {
    const response = await fetch(`${STAMPCHAIN_API_URL}/stamps/${identifier}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    const data = await response.json();
    return data;
  }


}
