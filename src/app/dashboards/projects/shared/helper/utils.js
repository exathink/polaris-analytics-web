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

export function allPairs(arr) {
  const res = pairwise(arr);
  const [min, max] = [res[0][0], res[res.length - 1][1]];
  return [[0, min], ...res, [max, Infinity]];
}

export function getCategories(colWidthBoundaries) {
  const res = pairwise(colWidthBoundaries);
  const [min, max] = [res[0][0], res[res.length - 1][1]];
  const middle = res.map((x) => `${x[0]} - ${x[1]} days`);
  const start = `< ${min} days`;
  const end = `${max} + days`;
  return [start, ...middle, end];
}