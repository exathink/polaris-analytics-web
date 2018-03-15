import './dashboard.css';
import React from 'react';
import Menu from './menu';
import LayoutWrapper from '../../components/utility/layoutWrapper';


export class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {maximizedRow: null, maximizedItem: null};
  }

  onItemStateChange(row, item, maximized) {
    this.setState({maximizedRow: maximized? row: null, maximizedItem: maximized? item: null})
  }

  render() {

    const children = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        onItemStateChange: (row,item, maximized) => this.onItemStateChange(row, item, maximized),
        maximizedRow: this.state.maximizedRow,
        maximizedItem: this.state.maximizedItem
      })
    });

    return <LayoutWrapper id="dashboard" className="dashboard-wrapper">
      <div className="dashboard-vizzes">
        { children }
      </div>
      <Menu />
    </LayoutWrapper>
  }
}

