import React from 'react';
import {NavigationContext} from "../../framework/navigation/context/navigationContext";

export default () => (
  <NavigationContext.Consumer>
    {
      navigationContext => {
        const currentContext = navigationContext.current;
        if(currentContext) {
          const display = currentContext.display();
          const contextStyle = {color: currentContext.color()};

          return (
            <div className="topBarContext">
              <i className={currentContext.icon()} style={contextStyle}/>
              {
                display ? <span style={contextStyle}>{display}</span> : null
              }
            </div>
          )
        } else {
          return null;
        }
      }
    }
  </NavigationContext.Consumer>
);





