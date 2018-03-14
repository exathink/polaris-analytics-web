import React from 'react';
import { Flex } from 'reflexbox';
import { connect } from 'react-redux';
import actions from '../../redux/viz/actions';

const ExpandedMenu = ({ vizId, contract }) => (
  <nav className="dashboard-expanded-menu">
    <i
      className="ion ion-arrow-shrink"
      title="Contract"
      onClick={ () => contract() }></i>
  </nav>
);

const Expanded = ({ contract, children }) => (
  <Flex className='dashboard-expanded'>
    <ExpandedMenu contract={contract} />
    { children }
  </Flex>
);

const mapDispatchToProps = dispatch => ({
  contract: () => dispatch(actions.contractViz())
});

export default connect(state => ({}), mapDispatchToProps)(Expanded)
