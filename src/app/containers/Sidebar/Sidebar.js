import React, {Component} from 'react';
import {connect} from 'react-redux';
import clone from 'clone';
import {Route, Link, NavLink} from 'react-router-dom';
import {Layout} from 'antd';
import {Scrollbars} from 'react-custom-scrollbars';
import Menu from '../../../components/uielements/menu';
import IntlMessages from '../../../components/utility/intlMessages';
import SidebarWrapper from './sidebar.style';

import appActions from '../../../redux/app/actions';
import Logo from '../../../components/utility/logo';
import {rtl} from '../../../config/withDirection';
import {getCurrentTheme} from '../../../containers/ThemeSwitcher/config';
import {themeConfig} from '../../../config';

const {Sider} = Layout;
const {
  toggleOpenDrawer,
  changeOpenKeys,
  changeCurrent,
  toggleCollapsed,
} = appActions;

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.onOpenChange = this.onOpenChange.bind(this);
  }

  handleClick(e) {
    this.props.changeCurrent([e.key]);
    if (this.props.app.view === 'MobileView') {
      setTimeout(() => {
        this.props.toggleCollapsed();
        this.props.toggleOpenDrawer();
      }, 100);
    }
  }

  onOpenChange(newOpenKeys) {
    const {app, changeOpenKeys} = this.props;
    const latestOpenKey = newOpenKeys.find(
      key => !(app.openKeys.indexOf(key) > -1)
    );
    const latestCloseKey = app.openKeys.find(
      key => !(newOpenKeys.indexOf(key) > -1)
    );
    let nextOpenKeys = [];
    if (latestOpenKey) {
      nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    }
    if (latestCloseKey) {
      nextOpenKeys = this.getAncestorKeys(latestCloseKey);
    }
    changeOpenKeys(nextOpenKeys);
  }

  getAncestorKeys = key => {
    const map = {
      sub3: ['sub2'],
    };
    return map[key] || [];
  };

  renderView({style, ...props}) {
    const viewStyle = {
      marginRight: rtl === 'rtl' ? '0' : '-17px',
      paddingRight: rtl === 'rtl' ? '0' : '9px',
      marginLeft: rtl === 'rtl' ? '-17px' : '0',
      paddingLeft: rtl === 'rtl' ? '9px' : '0',
    };
    return (
      <div className="box" style={{...style, ...viewStyle}} {...props} />
    );
  }

  render() {
    const {url, app, toggleOpenDrawer} = this.props;
    const customizedTheme = getCurrentTheme('sidebarTheme', themeConfig.theme);
    const collapsed = clone(app.collapsed) && !clone(app.openDrawer);
    const {openDrawer} = app;
    const mode = collapsed === true ? 'vertical' : 'inline';
    const onMouseEnter = event => {
      if (openDrawer === false) {
        toggleOpenDrawer();
      }
      return;
    };
    const onMouseLeave = () => {
      if (openDrawer === true) {
        toggleOpenDrawer();
      }
      return;
    };
    const scrollheight = app.height;
    const styling = {
      backgroundColor: customizedTheme.backgroundColor,
    };
    const submenuColor = {
      color: customizedTheme.textColor,
    };

    const menuProps = {
      onClick: this.handleClick,
      theme: 'dark',
      mode: mode,
      openKeys: collapsed ? [] : app.openKeys,
      selectedKeys: app.current.length === 0 ? ['activity'] : app.current,
      onOpenChange: this.onOpenChange,
      className: "isoDashboardMenu"
    };

    return (
      <SidebarWrapper>
        <Sider
          trigger={null}
          collapsible={true}
          collapsed={collapsed}
          width="240"
          className="isomorphicSidebar"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={styling}
        >
          <Logo collapsed={collapsed}/>
          <Scrollbars
            renderView={this.renderView}
            style={{height: scrollheight - 70}}
          >
            <Route path="/app/dashboard/(.*)/(.*)" render={(props) => (
              <React.Fragment>
                <Menu
                  {...menuProps}
                >
                  <Menu.Item key="activity">
                    <Link to={`/app/dashboard/activity/${props.match.params[1]}`}>
                      <span className="isoMenuHolder" style={submenuColor}>
                        <i className="ion-ios-pulse-strong"/>
                        <span className="nav-text">
                          <IntlMessages id={'sidebar.activity'}/>
                        </span>
                      </span>
                    </Link>
                  </Menu.Item>
                </Menu>
                <Menu
                  {...menuProps}
                >
                  <Menu.Item key="contributors">
                    <Link to={`/app/dashboard/contributors/${props.match.params[1]}`}>
                    <span className="isoMenuHolder" style={submenuColor}>
                      <i className="ion-ios-people"/>
                      <span className="nav-text">
                        <IntlMessages id={'sidebar.contributors'}/>
                      </span>
                    </span>
                    </Link>
                  </Menu.Item>
                </Menu>
              </React.Fragment>
              )}/>
          </Scrollbars>
        </Sider>
      </SidebarWrapper>
    );
  }
}


export default connect(
  state => ({
    app: state.App.toJS()
  }),
  {toggleOpenDrawer, changeOpenKeys, changeCurrent, toggleCollapsed}
)(Sidebar);
