import {useEffect, useState} from 'react';


export function useModuloCounter(n) {

  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setCounter((counter + 1) % 2), 5 * 1000);
    return () => window.clearInterval(timer)
  });

  return counter
}
