import {formatDate, getTodayDate} from "../../../../helpers/utility";

export function getFlowMetricsRowTitle(measurementWindow, before = getTodayDate()) {
  return before ? `${measurementWindow} days ending ${formatDate(before, "MM/DD/YYYY")} ` : ``;
}

export function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}