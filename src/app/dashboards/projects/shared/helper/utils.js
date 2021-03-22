export function getFlowMetricsRowTitle(before) {
  return before ? `Before Date: ${before.format("DD-MMM-YYYY")} ` : `Before Date: `;
}
