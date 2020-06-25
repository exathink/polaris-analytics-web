import React, {Component} from 'react';

import Popover from '../../../components/uielements/popover';
import TopbarDropdownWrapper from './topbarDropdown.style';
import {gravatar_url} from "../../helpers/gravatar";
import {FormattedMessage} from "react-intl";
import {withViewerContext} from "../../framework/viewer/viewerContext";
import {withNavigationContext} from "../../framework/navigation/components/withNavigationContext";

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

  logout(){
    this.props.navigate.push('/logout')
  }

  settings(){
    this.props.navigate.push('/app/admin');
    this.hide()
  }

  render() {
    const {viewerContext} = this.props;
    const userName = viewerContext.viewer.firstName;
    const content = (
      <TopbarDropdownWrapper className="isoUserDropdown">
        {
          viewerContext.hasSystemRoles(['admin', 'account-owner']) ?
            <span className="isoDropdownLink" style={{cursor: 'pointer'}} onClick={this.settings.bind(this)}>
              <p>Settings</p>
            </span>
            :
            null
        }
        <span className="isoDropdownLink" style={{cursor: 'pointer'}} onClick={this.logout.bind(this)}>
            <p>{messages.logout} {userName}</p>
        </span>
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
          <img alt="user" src={`${gravatar_url(viewerContext.viewer.email, 36, 'mm')}`} />
          <span className="userActivity online" />
        </div>
      </Popover>
    );
  }
}


export default withViewerContext(withNavigationContext(TopbarUser));
