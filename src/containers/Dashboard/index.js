import './dashboard.css';
import React from 'react';
import Menu from './menu';
import Expanded from './expanded';
import { connect } from 'react-redux';
import LayoutWrapper from '../../components/utility/layoutWrapper';

const getViz = (rows, id) => rows.map(
  r => r.props.children.map(i => i.props.children).filter(v => v.props.id === id)
)[0];

const Dashboard = ({ children, expanded, expandedViz }) => (
  <LayoutWrapper id="dashboard" className="dashboard-wrapper">
    {
      ! expanded &&
        <div className="dashboard-vizzes">{ children }</div>
      || <Expanded>{getViz(children, expandedViz)}</Expanded>
    }

    <Menu />
  </LayoutWrapper>
)

const mapStateToProps = state => ({
  expanded: state.dashboard.expanded,
  expandedViz: state.dashboard.expandedViz
});

export default connect(mapStateToProps)(Dashboard)
