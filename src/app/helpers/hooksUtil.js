import React from "react";

export function useOnlyRunOnUpdate(cb, deps) {
  const isInitialMount = React.useRef(true);

  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      // Your useEffect code here to be run on update
      cb();
    }
  }, deps);
}
