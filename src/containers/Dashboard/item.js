import React from 'react';
import { Box } from 'reflexbox';
import { connect } from 'react-redux';
import actions from '../../redux/viz/actions';

const ItemMenu = ({ vizId, expand }) => (
  <nav className="dashboard-item-menu">
    <i
      className="ion ion-arrow-expand"
      title="Expand"
      onClick={ () => expand(vizId) }></i>
  </nav>
);

const Item = ({ w=1, expand, children }) => (
  <Box w={w} m={1} className="dashboard-item">
    <ItemMenu vizId={ children.props.id } expand={expand} />
    { children }
  </Box>
);

const mapDispatchToProps = dispatch => ({
  expand: id => dispatch(actions.expandViz(id))
});

export default connect(state => ({}), mapDispatchToProps)(Item)
