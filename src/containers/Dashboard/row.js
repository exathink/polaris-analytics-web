import React from 'react';
import { Flex } from 'reflexbox';

export class DashboardRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {maximizedItem: null}
  }

  onItemStateChange(item,  maximized) {
    console.log("Row item maximized");
    this.setState({maximizedItem: maximized ? item: null});
    if (this.props.onItemStateChange) {
      this.props.onItemStateChange(this, item, maximized);
    }
  }

  render () {
    const hidden = this.props.maximizedRow != null && this.props.maximizedRow !== this;
    const maximized = this.props.maximizedRow != null && this.props.maximizedRow === this;
    if (hidden) {
      return null;
    } else {
      const height =  maximized ? "100%" : this.props.h;

      const children = React.Children.map(this.props.children, child => {
        return React.cloneElement(child, {
          onItemStateChange: (item, maximized) => this.onItemStateChange(item, maximized),
          maximizedRow: this.props.maximizedRow,
          maximizedItem: this.props.maximizedItem
        })
      });

      return <Flex auto align='center' justify='space-between' className="dashboard-row" style={{
        height: height
      }}>
        {children}
      </Flex>
    }
  }
}



