import {formatDate, getTodayDate} from "../../../../helpers/utility";

export function getTimePeriod(measurementWindow, before = getTodayDate()) {
  return before ? `${measurementWindow} days ending ${formatDate(before, "MM/DD/YYYY")} ` : ``;
}

export function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export function pairwise(arr) {
  let result = [];
  for (var i = 0; i < arr.length - 1; i++) {
    result.push([arr[i], arr[i + 1]]);
  }
  return result;
}