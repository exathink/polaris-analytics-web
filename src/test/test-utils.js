import {IntlProvider} from "react-intl";

import {formatDateTime} from "../app/i18n";
import {toMoment} from "../app/helpers/utility";

/* i18n Helpers */

export function getIntl() {
  // Create IntlProvider to retrieve React Intl context
  const intlProvider = new IntlProvider(
    {
      locale: "en",
    },
    {}
  );
  const {intl} = intlProvider.getChildContext();
  return intl;
}

const intl = getIntl();

export function formatDate(date) {
  return `${formatDateTime(intl, toMoment(date))}`
}

export function formatNumber(number) {
  return `${intl.formatNumber(number)}`
}


/* Expect helpers */

export function expectSetsAreEqual(arraya, arrayb) {
  expect(new Set(arraya)).toEqual(new Set(arrayb));
}