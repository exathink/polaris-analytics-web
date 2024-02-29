import {createIntl, createIntlCache} from "react-intl";

import {formatDateTime} from "../app/i18n";
import {toMoment} from "../app/helpers/utility";
import moment from "moment";

export const cloneDeep = require('lodash/cloneDeep');
export const set = require('lodash/set');
export const get = require('lodash/get');


/* i18n Helpers */

export function getIntl() {
  const cache = createIntlCache();

  const intl = createIntl(
    {
      locale: "en",
      messages: {},
    },
    cache
  );

  return intl;
}

const intl = getIntl();

export function formatDate(date) {
  return `${formatDateTime(intl, toMoment(date))}`
}

export function formatDateRaw(date) {
  return `${formatDateTime(intl, date)}`
}

export function formatNumber(number) {
  return `${intl.formatNumber(number)}`
}


/* Expect helpers */

export function expectSetsAreEqual(arraya, arrayb) {
  expect(new Set(arraya)).toEqual(new Set(arrayb));
}

export function getNDaysAgo(n) {
  return moment().subtract(n, "days").utc().format("YYYY-MM-DDTHH:mm:ss");
}

export function findNested(object, path, condition) {
  return get(object, path)?.find(condition)
}