import React, { Component } from 'react';
import { connect } from 'react-redux';
import Popover from '../../../components/uielements/popover';
import IntlMessages from '../../../components/utility/intlMessages';
import TopbarDropdownWrapper from './topbarDropdown.style';
import authActions from '../../../redux/auth/actions';
import {gravatar_url} from "../../helpers/gravatar";
import {FormattedMessage} from "react-intl";


const messages = {
  logout: <FormattedMessage id='topbaruser.logout' defaultMessage='Logout'/>,
};


class TopbarUser extends Component {
  constructor(props) {
    super(props);
    this.handleVisibleChange = this.handleVisibleChange.bind(this);
    this.hide = this.hide.bind(this);
    this.state = {
      visible: false
    };
  }
  hide() {
    this.setState({ visible: false });
  }
  handleVisibleChange() {
    this.setState({ visible: !this.state.visible });
  }

  render() {
    const userName = this.props.user && this.props.user.first_name;
    const content = (
      <TopbarDropdownWrapper className="isoUserDropdown">
        <a className="isoDropdownLink" onClick={this.props.logout}>
            <p>{messages.logout} {userName}</p>
        </a>
      </TopbarDropdownWrapper>
    );

    return (
      <Popover
        content={content}
        trigger="click"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
        arrowPointAtCenter={true}
        placement="bottomLeft"
      >
        <div className="isoImgWrapper">
          <img alt="user" src={`${gravatar_url(this.props.user.email, 36, 'mm')}`} />
          <span className="userActivity online" />
        </div>
      </Popover>
    );
  }
}

const { logout } = authActions;
const mapStateToProps = state => ({
  user: state.user.get('user')
});

export default connect(mapStateToProps, { logout })(TopbarUser);
