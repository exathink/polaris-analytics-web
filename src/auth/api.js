import { GET_USER_CONFIG } from './constants';

export const fetchUserData = async key => {
  const response = await fetch(GET_USER_CONFIG, {
    credentials: 'include',
    headers: {'X-XSRF-TOKEN': key, 'X-Requested-With': 'XMLHttpRequest'}
  });
  const data = await response.json();

  // Call me redundant-man
  return data.data;
};
