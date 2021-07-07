export const joinTeams = (node) => {
  return node.teamNodeRefs
    .map((t) => t.teamName)
    .sort()
    .join(", ");
};
