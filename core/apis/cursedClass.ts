
const RESPONSE_LIMIT = 200;
const STAMPCHAIN_API_URL="https://stampchain.io/api/v2";

export class CursedClass {


  /**
   * Fetches a specific page of cursed stamps from the API. Can be used with pagination.
   *
   * This function fetches a page of cursed stamps from the API, with a specified limit and sort order.
   *
   * @param limit - The number of stamps to fetch per page. Defaults to RESPONSE_LIMIT.
   * @param page - The page number to fetch. Defaults to 1.
   * @param sort_order - The order in which to sort the stamps. Can be 'asc' or 'desc'. Defaults to 'asc'.
   * @returns A promise that resolves to an object containing the fetched page of stamps.
   *
   * @example
   * const stampsPage = await StampsClass.fetch_stamps_by_page(100, 2, 'desc');
   */
    static async fetch_cursed_stamps_by_page(
      limit = RESPONSE_LIMIT,
      page = 1,
      sort_order: "asc" | "desc" = "asc",
      ) {
        const order = sort_order.toUpperCase() === "ASC" ? "asc" : "desc";
        const response = await fetch(`${STAMPCHAIN_API_URL}/cursed?limit=${limit}&page=${page}&sort_order=${order}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        const data = await response.json();
        return data;
      }

  /**
   * Fetches cursed stamps by block index from the API.
   *
   * This function retrieves the cursed stamps associated with the specified block index.
   *
   * @param block_index - The block index for which to fetch the cursed stamps.
   * @returns A promise that resolves to the data returned by the API. This includes information about the cursed stamps for the given block index.
   *
   * @example
   * const cursedStampsData = await CursedClass.get_cursed_stamps_by_block_index(830000);
   */
  static async get_cursed_stamps_by_block_index(
    block_index: number,
  ) {
    const cursedbyblock = await (await fetch(`${STAMPCHAIN_API_URL}/cursed/block/${block_index}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })).json();
    return cursedbyblock;
  }

}

/** calls for specific cursed stamps can use the /stamps/ api endupoing using the cursed negative stamp #, stamp_hash, or tx_id */