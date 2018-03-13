import React, { Component } from 'react';
import screenfull from 'screenfull';

class FullscreenBtn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activated: false
    };
  }

  toggleFullscreen() {
    const  { componentId } = this.props;

    screenfull.toggle(document.getElementById(componentId));

    this.setState({
      activated: !screenfull.isFullscreen
    });
  }

  render() {
    return (
      <i
        className={'menu-item ion ion-android' + (this.state.activated ? '-contract' : '-expand')}
        title={(this.state.activated ? 'Exit' : 'Go') + ' Fullscreen' }
        onClick={() => this.toggleFullscreen()}
      ></i>
    );
  }
}

export default FullscreenBtn;
