const src20_listing_api = [
  {
    name: "stampscan_listing_summary",
    url: "https://api.stampscan.xyz/market/listingSummary",
  },
];

/**
 * Executes a market listing query for SRC20 tokens by making requests to multiple API endpoints.
 * The function iterates over a list of API endpoints, sending a GET request to each one.
 * It returns the response from the first endpoint that returns a non-null result.
 * If all requests fail, it logs an error and returns null.
 *
 * @param payload - The payload for the query. Currently not used in the function.
 * @returns The result of the query as a JSON object, or null if all requests fail.
 */
export const SRC20MarketListingQuery = async (payload: any) => {
  for (const node of src20_listing_api) {
    const response = await fetch(node.url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    if (result !== null) {
      return result;
    }
  }
  console.error("All queries to the nodes have failed.");
  return null;
};
