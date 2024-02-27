/**
 * Convert a GraphQL connection to an array of Cytoscape.js elements.
 * It is expected that each of the graphql nodes will have and id, name and key field.
 *
 * @param {Object} connection - The GraphQL connection object.
 * @param {string} parentKey - The property key that represents the parent node in the connection. There is a single
 * parent key
 * @param {string} childKey - The property key that represents the child nodes in the connection. Each child node in the
 * connection is related to the parent node via an edge.
 *
 * @return {Array} - An array of Cytoscape.js elements.
 * The elements include both parent and child nodes, as well as the edges linking them.
 * The key field on the graphql connection nodes is turned into the id field for cytoscape nodes.
 *
 * All attributes on the graphql parent and child nodes are available as attributes on the cytoscape nodes.
 */
export function graphqlConnectionToCyElements(connection, parentKey, childKey) {
  const parentNode = connection[parentKey];
  if (parentNode) {
    const childNodes = parentNode[childKey].edges.map(edge => edge.node);
    if (childNodes) {  // Added null check for childNodes
      let elements = [];
      // Add the parent node
      const {name, key} = parentNode;
      elements.push({
        data: {
          name,
          key,
          typename: parentNode.__typename,
          id: parentNode.key
        }
      });

      // Add each child node
      childNodes.forEach((childNode) => {
        const {__typename, ...nodeWithoutTypename} = childNode; // remove __typename from child node
        elements.push({
          data: {
            ...nodeWithoutTypename,
            typename: __typename, // renamed __typename to typename
            id: childNode.key
          }
        });

        // Add an edge for each child node, linking it to the parent node
        // The edge id is constructed by concatenating the parent node id and the child node id with an underscore
        elements.push({
          data: {
            id: `${parentNode.key}_${childNode.key}`,
            source: parentNode.key,
            target: childNode.key
          }
        });
      });

      return elements;
    }

  }
  return [];
}