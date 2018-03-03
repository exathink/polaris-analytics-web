import React from 'react'
import {connect} from "react-redux";
import ReactPlaceholder from 'react-placeholder';
import "react-placeholder/lib/reactPlaceholder.css";
import vizActions from '../redux/viz/actions';

const { fetchData } = vizActions;

class Viz extends React.Component {

  componentWillMount() {
    let viz_domain = this.props.component.viz_domain(this.props);
    if (!this.props.viz_data.get(viz_domain)) {
      if(this.props.account) {
        this.props.fetchData({viz_domain: viz_domain})
      }
    }
  }

  render() {
    let viz_domain = this.props.component.viz_domain(this.props);
    let viz_data = this.props.viz_data.get(viz_domain);
    let {component: Component} = this.props;
    return (
      <ReactPlaceholder
        showLoadingAnimation
        type="text"
        rows={7}
        ready={viz_data != null}
      >
        <Component {...this.props}/>
      </ReactPlaceholder>
    )
  }

}

const mapStateToProps = state => ({
  user: state.user.get('user'),
  account: state.user.get('account'),
  viz_data: state.viz
});

export default connect(
  mapStateToProps,
  { fetchData }
)(Viz);