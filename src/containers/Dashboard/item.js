import React from 'react';
import { Box } from 'reflexbox';


export class ItemMenu extends React.Component {

  render() {
    return <nav className="dashboard-item-menu">
      <i
        className={this.props.isMaximized?  "ion ion-arrow-shrink" : "ion ion-more"}
        title={this.props.isMaximized? "Hide Details" : "Show Details"}
        onClick={this.props.onClick}/>
      <div>{this.props.index}</div>
    </nav>
  }
}


export class DashboardItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {maximized: false, minimizing: false}
  }

  toggleState() {
    console.log("maximized..");
    const newState = (this.state.maximized ?
      {maximized: !this.state.maximized, minimizing: true} :
      {maximized: !this.state.maximized, minimizing: false}
    );

    this.setState(newState);
    if (this.props.onItemStateChange) {
      this.props.onItemStateChange(this, newState.maximized);
    }
  }

  minimize() {
    this.setState({maximized: this.maximized, minimizing:false})
  }

  render() {
    if((this.props.maximizedItem != null) && (this.props.maximizedItem !== this)) {
      return null;
    } else if (this.state.minimizing) {
      window.setTimeout(()=>{this.minimize()}, 1);
      return <Box w={this.props.width} m={1} className="dashboard-item">
      </Box>
    } else {
      const width = (this.state.maximized ? 1 : this.props.w);

      const children = React.Children.map(this.props.children, child => {
        return React.cloneElement(child, {
          isMaximized: this.state.maximized
        })
      });

      return <Box w={width} m={1} className="dashboard-item">
        <ItemMenu index={this.props.index} isMaximized={this.state.maximized} onClick={() => this.toggleState()}/>
        {children}
      </Box>
    }
  }

}



