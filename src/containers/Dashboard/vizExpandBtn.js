import actions from '../../redux/viz/actions';

const VizExpandBtn = props => (
  <i
    className="ion ion-arrow-expand"
    title="Expand"
    onClick={() => this.props.expand}>
  </i>
);

const mapDispatchToProps = dispatch => ({
  expand: vizToExpand => dispatch({
    type: actions.EXPAND_VIZ,
    viz: vizToExpand
  })
});
