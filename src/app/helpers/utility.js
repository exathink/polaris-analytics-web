import { Map } from 'immutable';
import moment from 'moment';

export function clearToken() {
  localStorage.removeItem('id_token');
}

export function getToken() {
  try {
    const idToken = localStorage.getItem('id_token');
    return new Map({ idToken });
  } catch (err) {
    clearToken();
    return new Map();
  }
}

export function timeDifference(givenTime) {
  givenTime = new Date(givenTime);
  const milliseconds = new Date().getTime() - givenTime.getTime();
  const numberEnding = number => {
    return number > 1 ? 's' : '';
  };
  const number = num => num > 9 ? '' + num : '0' + num;
  const getTime = () => {
    let temp = Math.floor(milliseconds / 1000);
    const years = Math.floor(temp / 31536000);
    if (years) {
      const month = number(givenTime.getUTCMonth() + 1);
      const day = number(givenTime.getUTCDate());
      const year = givenTime.getUTCFullYear() % 100;
      return `${day}-${month}-${year}`;
    }
    const days = Math.floor((temp %= 31536000) / 86400);
    if (days) {
      if (days < 28) {
        return days + ' day' + numberEnding(days);
      } else {
        const months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];
        const month = months[givenTime.getUTCMonth()];
        const day = number(givenTime.getUTCDate());
        return `${day} ${month}`;
      }
    }
    const hours = Math.floor((temp %= 86400) / 3600);
    if (hours) {
      return `${hours} hour${numberEnding(hours)} ago`;
    }
    const minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
      return `${minutes} minute${numberEnding(minutes)} ago`;
    }
    return 'a few seconds ago';
  };
  return getTime();
}

export function getCookie(n) {
  const c = `; ${document.cookie}`.match(`;\\s*${n}=([^;]+)`);
  return c ? c[1] : null;
}

export function timestamp(t = new Date().getTime()){
  return Math.round(t / 1000);
}

export function formatPolarisTimestamp(moment) {
  return moment.format("DD-MM-YYYY HH:mm.ss")
}
export function polarisTimestamp(timestamp) {
  return moment(timestamp, "DD-MM-YYYY HH:mm.ss")
}

export function polarisTimestampWithTZ(timestamp) {
  return moment(timestamp, "DD-MM-YYYY HH:mm.ss Z")
}

export function formatDate(epoch, format) {
  return moment(epoch).format(format)
}

export function span(date_a, date_b) {
  return polarisTimestamp(date_a).diff(polarisTimestamp(date_b))
}

export function fail(message) {
  throw Error(message);
}

export function replicate(array, n) {
  return Array(n).fill(0).reduce((result) => ([...result, ...array]), [])
}

export function human_span(date_a, date_b) {
  const moment_a = moment(date_a);
  const moment_b = moment(date_b);
  const span = moment.duration(moment_a.diff(moment_b));
  const years = span.years();
  const d_years = `${years > 0 ? years + (years > 1 ? ' Years' : ' Year'): ''}`;

  const months = span.months();
  const d_months = `${months > 0 ? months + (months > 1 ? ' Months': ' Month'): ''}`;
  return years+months > 0 ? `${d_years}${(years > 0 ? ', ' : '')}${d_months}` : '0 Years';
}

export function elide(str, length) {
  return str.length < length ? str : `${str.substring(0, length)} ...`
}

export function capitalizeFirstLetter(string) {
    return string && string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function daysFromNow(aMoment, useUTC=true){
  return moment.duration((useUTC ? moment.utc() : moment()).diff(aMoment)).asDays()
}

export function week_to_date(year, week) {
  // week 53 (leap week) is not handled properly by moment. Coerce it back to week 52.
    // this calc is not accurate strictly speaking, but it is good enough for
    // most cases and wont matter much in the overall display of the chart.
    // Can revisit if we need to.
    const adjusted_week = `${Math.min(week, 52)}`.padStart(2, '0');
    return moment(`${year}W${adjusted_week}`);
}

export function toMoment(serverCommitDate) {
  return moment(`${serverCommitDate}Z`);
}

export function formatCommitDate(serverCommitDate) {
  return toMoment(serverCommitDate).format("dddd MM/DD/YYYY hh:mm a")
}

export function fromNow(serverCommitDate) {
  return moment.duration(toMoment(serverCommitDate).diff(moment.utc())).humanize(true)
}

export function isToday(serverCommitDate) {
  return moment.duration(moment.utc().diff(toMoment(serverCommitDate))).asDays() < 1;
}

export function getCommitTimelineEndWindow(latestCommit) {
  return isToday(latestCommit) ? null : latestCommit
}

export function snakeToUpperCamel(s) {
  return s.split('_').reduce((res, word, i) => `${res}${word.charAt(0).toUpperCase()}${word.substr(1).toLowerCase()}`, '');
}

export function isAdmin(viewer) {
  return viewer.roles && viewer.roles.includes("admin");
}