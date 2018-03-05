import React from 'react'
import {connect} from "react-redux";
import ReactPlaceholder from 'react-placeholder';
import "react-placeholder/lib/reactPlaceholder.css";
import vizActions from '../redux/viz/actions';
import PropTypes from 'prop-types';

const { fetchData } = vizActions;

class Viz extends React.Component {
  static propTypes = {
    viz_data: PropTypes.object,
    user: PropTypes.object,
    account: PropTypes.object
  };

  componentWillMount() {
    let viz_domains = this.props.component.viz_domains(this.props);
    viz_domains.forEach((viz_domain) => {
      if (!this.props.viz_data.get(viz_domain)) {
        this.props.fetchData({viz_domain: viz_domain})
      }
    })
  }

  ready() {
    let viz_domains = this.props.component.viz_domains(this.props);
    return viz_domains.every((viz_domain) => {
      return this.props.viz_data.get(viz_domain) != null;
    })
  }

  render() {
    let {component: Component} = this.props;
    return (
      <ReactPlaceholder
        showLoadingAnimation
        type="text"
        rows={7}
        ready={this.ready()}
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