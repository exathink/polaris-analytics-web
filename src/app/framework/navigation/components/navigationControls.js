import React from 'react';
import {NavigationContext} from "../context/navigationContext";

const BackButton = (props) => {
  const {navigation, navigate, itemClass} = props;
  const prev = navigation.prev();
  const buttonClass = !prev  ? 'disabled' : '';
  return(
    <i title="Back"
       className={`${itemClass} ${buttonClass} ion ion-arrow-left-a`}
       onClick={() => prev ? navigate.push(prev.targetUrl) : null}
    />
  );
};

const ForwardButton = (props) => {
  const {navigation, navigate, itemClass} = props;
  const next = navigation.next();
  const buttonClass = !next  ? 'disabled' : '';
  return(
    <i title="Forward"
       className={`${itemClass} ${buttonClass} ion ion-arrow-right-a`}
       onClick={() =>next ? navigate.push(next.targetUrl) : null}
    />
  );
};

const DrillBackButton = (props) => {
  const {navigation, navigate, itemClass} = props;
  const prev = navigation.prevContext();
  const buttonClass = !prev  ? 'disabled' : '';
  return(
    <i title="Drill Back"
       className={`${itemClass} ${buttonClass} ion ion-arrow-up-a`}
       onClick={() => prev ? navigate.push(prev.targetUrl) : null}
    />
  );
};

export default class NavigationControls extends React.Component {
  render() {
    return (
      <NavigationContext.Consumer>
        {
          navigationContext => {
            const childProps = {...this.props, ...navigationContext};
            return (
              <React.Fragment>
                <BackButton {...childProps}/>
                <DrillBackButton {...childProps}/>
                <ForwardButton {...childProps}/>
              </React.Fragment>
            )
          }
        }
      </NavigationContext.Consumer>
    )
  }
}


