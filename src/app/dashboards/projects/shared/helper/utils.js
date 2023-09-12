import {formatDate, getTodayDate, i18nNumber} from "../../../../helpers/utility";
import {WorkItemStateTypes} from "../../../shared/config";

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

function breakArrIntoTwo(colWidthBoundaries) {
  return [colWidthBoundaries.filter(x => x <= 1), colWidthBoundaries.filter(x => x > 1)]
}

export function getHistogramCategories(colWidthBoundaries, uom) {
  let boundaries = colWidthBoundaries;
  let lessThanOneArr = [];
  if (colWidthBoundaries[0] <= 1) {
    const [lessThanOne, greaterThanEqualOne] = breakArrIntoTwo(colWidthBoundaries);
    boundaries = greaterThanEqualOne;

    lessThanOneArr = lessThanOne.map((x) => {
      if (x < 1 / 24) {
        return `< ${x * 24 * 60} mins`;
      } else if ( x < 1 ){
        return `< ${x * 24} hours`;
      } else {
        // bit of a hack - the two uoms here currently are days and FTE Days
        // so this will work - we should probably be using i18N utils here instead,
        // but not sure how to fully integrate FTE days.
        return `< 1 ${uom.replace('s', '')}`
      }
    });
  }
  const res = pairwise(boundaries);
  let [min, max] = [res[0][0], res[res.length - 1][1]];
  let start = `< ${min} ${uom}`;

  const middle = res.map((x) => `${x[0]} - ${x[1]} ${uom}`);

  const end = `${max} + ${uom}`;
  return [...lessThanOneArr, start, ...middle, end];
}

export function getHistogramSeries({intl, colWidthBoundaries, points, color, visible, name, id, originalData=[]}) {
  const allPairsData = allPairs(colWidthBoundaries);
  const data = new Array(allPairsData.length).fill({y: 0, total: 0, bucket: []});
  points.forEach((y, index) => {
    for (let i = 0; i < allPairsData.length; i++) {
      const [x1, x2] = allPairsData[i];
      if (y >= x1 && y < x2) {
        data[i] = {y: data[i].y + 1, total: data[i].total + y, bucket: [...data[i].bucket, originalData[index]]};

        // we found the correct bucket, no need to traverse entire loop now
        break;
      }
    }
  });

  const optionalProps = {};
  if (color !== undefined) {
    optionalProps.color = color;
  }
  if (visible !== undefined) {
    optionalProps.visible = visible;
  }

  return {
    id: id,
    name: name,
    data: data,
    ...optionalProps,
    dataLabels: {
      enabled: true,
      formatter: function () {
        if (this.point.y === 0 || points.length === 0) {
          return "";
        } else {
          const fractionVal = this.point.y / points.length;
          const percentVal = i18nNumber(intl, fractionVal * 100, 2);
          return `${percentVal}%`;
        }
      },
    },
  };
}

export function isClosed(stateType) {
  return stateType === WorkItemStateTypes.closed;
}

export function getPercentage(fractionVal, intl) {
  const percentVal = i18nNumber(intl, fractionVal * 100, 2);
  return `${percentVal}%`;
}

export const QUERY_PARAM_KEYS = {
  vs: "vs",
  release: "release"
}