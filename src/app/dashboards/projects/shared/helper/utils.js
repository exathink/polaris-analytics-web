import {formatDate, getServerDate} from "../../../../helpers/utility";

export function getFlowMetricsRowTitle(measurementWindow, before = getServerDate()) {
  return before ? `${measurementWindow} days ending ${formatDate(before, "MM/DD/YYYY")} ` : ``;
}
