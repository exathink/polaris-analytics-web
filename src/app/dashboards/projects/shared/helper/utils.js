import {getServerDate} from "../../../../helpers/utility";

export function getFlowMetricsRowTitle(measurementWindow, before = getServerDate()) {
  return before ? `${measurementWindow} days ending ${before.format("MM/DD/YYYY")} ` : ``;
}
