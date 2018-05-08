import React from 'react';
import {withNavigation} from "../../navigation/withNavigation";

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

class NavigationControls extends React.Component {

  render() {
    return (
      <React.Fragment>
        <BackButton {...this.props}/>
        <DrillBackButton {...this.props}/>
        <ForwardButton {...this.props}/>
      </React.Fragment>
    )
  }
}

export default withNavigation(NavigationControls);

