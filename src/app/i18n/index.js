import Enlang from './entries/en_US';
import Eslang from './entries/es_ES';

const AppLocale = {
  en: Enlang,
  es: Eslang,
};

require('@formatjs/intl-pluralrules/polyfill')
require('@formatjs/intl-pluralrules/locale-data/en') // Add locale data for en
require('@formatjs/intl-pluralrules/locale-data/es') // Add locale data for es

require('@formatjs/intl-relativetimeformat/polyfill')
require('@formatjs/intl-relativetimeformat/locale-data/en') // Add locale data for en
require('@formatjs/intl-relativetimeformat/locale-data/es') // Add locale data for es

export default AppLocale;

export * from './utils';