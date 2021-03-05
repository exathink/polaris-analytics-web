import antdEn from 'antd/lib/locale-provider/en_US';
import enMessages from '../locales/en_US.json';
// import { getKeys, getValues } from '../conversion';
// getValues(enMessages);

const EnLang = {
  messages: {
    ...enMessages,
  },
  antd: antdEn,
  locale: 'en-US',
};
export default EnLang;
