import React, { Component } from 'react';
import { connect } from 'react-redux';
import {withRouter} from 'react-router';

import { Layout } from 'antd';
import appActions from '../../../redux/app/actions';
import TopbarUser from './topbarUser';
import TopbarWrapper from './topbar.style';
import themes from '../../../config/themes';
import { themeConfig } from '../../../config';
import TopbarContext from './topbarContext';

const { Header } = Layout;
const { toggleCollapsed } = appActions;
const customizedTheme = themes[themeConfig.theme];

class Topbar extends Component {
  render() {
    const { toggleCollapsed } = this.props;
    const collapsed = this.props.collapsed && !this.props.openDrawer;
    const styling = {
      background: customizedTheme.backgroundColor,
      position: 'fixed',
      width: '100%',
      height: 56
    };
    return (
      <TopbarWrapper>
        <Header
          style={styling}
          className={
            collapsed ? 'isomorphicTopbar collapsed' : 'isomorphicTopbar'
          }
        >
          <div className="isoLeft">
            <button
              className={
                collapsed ? 'triggerBtn menuCollapsed' : 'triggerBtn menuOpen'
              }
              style={{ color: customizedTheme.textColor }}
              onClick={toggleCollapsed}
            />
          </div>

          <div className={"isoLeft"}>
            <TopbarContext/>
          </div>

          <ul className="isoRight">
            <li
              onClick={() => this.setState({ selectedItem: 'user' })}
              className="isoUser"
            >
              <TopbarUser />
            </li>
          </ul>
        </Header>
      </TopbarWrapper>
    );
  }
}

export default withRouter(connect(
  state => ({
    ...state.App.toJS()
  }),
  { toggleCollapsed }
)(Topbar));
