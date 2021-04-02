import React, { Component } from 'react';
import screenfull from 'screenfull';
import {withNavigationContext} from "../../app/framework/navigation/components/withNavigationContext";
import {withViewerContext} from '../../app/framework/viewer/viewerContext';
import styles from "./buttons.module.css"
class FullscreenBtn extends Component {

  componentDidUpdate() {
    const {fullScreen, componentId, viewerContext: {resetStore}} = this.props;

    if(fullScreen !== screenfull.isFullscreen) {
      screenfull.toggle(document.getElementById(componentId));
      resetStore();
    }

  }


  render() {
    const {fullScreen, setFullScreen} = this.props;
    return (
      <i
        className={styles["menu-item"]+ ' ion ion-android' + (fullScreen ? '-contract' : '-expand')}
        title={(fullScreen ? 'Exit' : 'Go') + ' Fullscreen' }
        onClick={() => {setFullScreen(!fullScreen)}}
      ></i>
    );
  }
}

export default withViewerContext(withNavigationContext(FullscreenBtn));
