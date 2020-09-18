import {useEffect, useState} from 'react';

// Sets a timer that increments a counter from 0 modulo n and each tick millisecs.
export function useGenerateTicks(n, interval) {

  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setTick((tick + 1) % n), interval);
    return () => window.clearInterval(timer)
  });

  return tick
}
