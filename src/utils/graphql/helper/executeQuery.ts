/**
 * Executes a GraphQL query against a specified URL, handling the request and response.
 * This function is designed to make a POST request to a GraphQL API, sending a query
 * and any associated variables, then parsing and returning the response data.
 *
 * @param {string} url - The endpoint URL of the GraphQL server.
 * @param {string} query - The GraphQL query string to be executed.
 * @param {Object} [variables] - An optional object containing variables for the GraphQL query.
 *
 * @returns {Promise<Object>} - A promise that resolves to the data object from the GraphQL response.
 *                              If the response contains errors or the network request fails, an error
 *                              is logged, and the function either returns undefined or rethrows the error.
 *
 * @throws {Error} - If there is an issue with the network request or if the response cannot be parsed.
 *
 * @example
 * const url = "https://api.example.com/graphql";
 * const query = `
 *   query GetUser($id: ID!) {
 *     user(id: $id) {
 *       id
 *       name
 *     }
 *   }
 * `;
 * const variables = { id: "123" };
 *
 * executeQuery(url, query, variables)
 *   .then(data => {
 *     console.log("User data:", data.user);
 *   })
 *   .catch(error => {
 *     console.error("Error fetching user data:", error);
 *   });
 *
 * // In this example, `data.user` will contain the `id` and `name` fields of the user with ID 123.
 */
export const executeQuery = async (url, query, variables) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: query,
        variables
      })
    });

    if (!response.ok) {
      console.error("Network response was not ok", response.statusText);
      return;
    }

    const responseText = await response.text();

    const result = JSON.parse(responseText);

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
    }

    return result?.data;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};
