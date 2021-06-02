import {diff_in_dates, formatDate, getTodayDate} from "../../../../helpers/utility";

export function getFlowMetricsRowTitle(measurementWindow, before = getTodayDate()) {
  return before ? `${measurementWindow} days ending ${formatDate(before, "MM/DD/YYYY")} ` : ``;
}

export const SORTER = {
  number_compare: (numa, numb) => {
    return numa - numb;
  },
  string_compare: (stra, strb) => {
    return stra.localeCompare(strb);
  },
  date_compare: (date_a, date_b) => {
    const span = diff_in_dates(date_a, date_b);
    return span["_milliseconds"];
  },
};

export function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}