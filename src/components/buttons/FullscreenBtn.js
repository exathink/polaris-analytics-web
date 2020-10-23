import React, { Component } from 'react';
import screenfull from 'screenfull';
import {withNavigationContext} from "../../app/framework/navigation/components/withNavigationContext";

class FullscreenBtn extends Component {

  componentDidUpdate() {
    const {fullScreen, componentId} = this.props;

    if(fullScreen !== screenfull.isFullscreen) {
      screenfull.toggle(document.getElementById(componentId));
    }

  }


  render() {
    const {fullScreen, setFullScreen} = this.props;
    return (
      <i
        className={'menu-item ion ion-android' + (fullScreen ? '-contract' : '-expand')}
        title={(fullScreen ? 'Exit' : 'Go') + ' Fullscreen' }
        onClick={() => {setFullScreen(!fullScreen)}}
      ></i>
    );
  }
}

export default withNavigationContext(FullscreenBtn);
