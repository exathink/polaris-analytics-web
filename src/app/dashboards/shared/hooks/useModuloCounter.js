import {useEffect, useState} from 'react';

// Sets a timer that increments a counter from 0 modulo n and each tick millisecs.
export function useModuloCounter(n, tick) {

  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setCounter((counter + 1) % n), tick);
    return () => window.clearInterval(timer)
  });

  return counter
}
