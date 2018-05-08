import React from 'react';
import {withNavigation} from "../../navigation/withNavigation";

class NavigationControls extends React.Component {

  constructor(props) {
    super(props);
  }


  drillBack() {
    const {navigation, navigate} = this.props;
    if (navigation.length > 1) {
      navigate.go(navigation[1].targetUrl())
    }
  };

  render() {
    const {navigate, itemClass} = this.props;
    return (
      <React.Fragment>
        <i title="Back" className={`${itemClass} ion ion-arrow-left-a`} onClick={() => navigate.goBack()}/>
        <i title="Drill Back" className={`${itemClass} ion ion-arrow-up-a`} onClick={() => this.drillBack()}/>
        <i title="Forward" className={`${itemClass} ion ion-arrow-right-a`} onClick={() => navigate.goForward()}/>
      </React.Fragment>
    )
  }

}

export default withNavigation(NavigationControls);

