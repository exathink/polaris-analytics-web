import React from 'react';

export const withViewSelector  = ({ selector, ...views}) => (
  (props: Props) => {
    const key = selector(props);
    const SelectedView = views[key];
    if (SelectedView != null) {
      return <SelectedView {...props}/>
    } else {
      throw Error(`View selector returned a key '${key}' that was not in the view selector map `);
    }
  }
);

export const withMaxMinViews = ({minimized: MinView, maximized: MaxView}) => {
  return withViewSelector({
      selector: (props) => !props.itemSelected ? 'minimized' : 'maximized',
      minimized: MinView,
      maximized: MaxView
    }
  );
}
