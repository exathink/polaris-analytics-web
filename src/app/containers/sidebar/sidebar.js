import React, {Component} from 'react';
import {connect} from 'react-redux';
import clone from 'clone';
import {Link, withRouter} from 'react-router-dom';
import {Layout} from 'antd';
import {Scrollbars} from 'react-custom-scrollbars';
import Menu from '../../../components/uielements/menu';
import IntlMessages from '../../../components/utility/intlMessages';
import SidebarWrapper from './sidebar.style';

import appActions from '../../../redux/app/actions';
import Logo from './logo';
import {rtl} from '../../../config/withDirection';
import {getCurrentTheme} from '../../../containers/ThemeSwitcher/config';
import {themeConfig} from '../../../config';
import Icons from '../../helpers/icons';
import {getCurrentTopics} from "../redux/sidebar/reducer";

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
    const {app, toggleOpenDrawer} = this.props;
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
    const { navigation } = this.props;
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
            {
              navigation.map(
                topic => (
                  <Menu key={`${topic.routeTree.context}`} {...menuProps} >
                    <Menu.Item key={`${topic.routeTree.context}`}>
                      <Link to={`${topic.link}`}>
                      <span className="isoMenuHolder" style={submenuColor}>
                        <i className={`${Icons.topics[topic.name]}`}/>
                        <span className="nav-text">
                          {topic.routeTree.context}
                        </span>
                      </span>
                      </Link>
                    </Menu.Item>
                  </Menu>
                )
              )
            }
          </Scrollbars>
        </Sider>
      </SidebarWrapper>
    );
  }
}



export default withRouter(connect(
  state => ({
    app: state.App.toJS(),
    navigation: state.navigation.toJS()
  }),
  {toggleOpenDrawer, changeOpenKeys, changeCurrent, toggleCollapsed}
)(Sidebar));
