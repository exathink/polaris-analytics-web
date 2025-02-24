import {Terms} from "./terms";

export function displaySingular(intl, context) {
  return intl.formatMessage(context.message, {quantity: 1})
}

export function displayPlural(intl, context) {
  return intl.formatMessage(context.message, {quantity: 0})
}

export function formatTerm(intl, message, values = {}) {
  const md = Terms[message];
  if (md) {
    return intl.formatMessage(md, values)
  } else {
    console.log(`Could not find term for ${message}`);
    return `<${message}>`
  }
}



export function formatDateTime(intl, datetime) {
  return intl.formatDate(datetime, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
}

export function formatAsDate(intl, datetime) {
  return intl.formatDate(datetime, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })
}