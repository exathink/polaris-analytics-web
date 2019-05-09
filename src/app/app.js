import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Layout} from 'antd';
import {Debounce} from 'react-throttle';
import WindowResizeListener from 'react-window-size-listener';
import {ThemeProvider} from 'styled-components';
import authAction from '../redux/auth/actions';
import appActions from '../redux/app/actions';
import Sidebar from './containers/sidebar/sidebar';
import Topbar from './containers/topbar/topbar';
import AppRouter from './appRouter';
import {siteConfig} from '../config.js';
import themes from '../config/themes/index';
import {themeConfig} from '../config';
import AppHolder from './commonStyle';
import './global.css';
import './framework/viz/dashboard/dashboard.css';
import {DashboardControlBar} from "./containers/controlbar/controlbar";
import LayoutWrapper from '../components/utility/layoutWrapper';
import AppContext from './context';
import {build_context_url_tree} from "./framework/navigation/context/helpers";
import {NavigationContext} from "./framework/navigation/context/navigationContext";
import {UserContext} from "./framework/user/userContext";



const {Content, Footer} = Layout;
const {logout} = authAction;
const {toggleAll} = appActions;

export class App extends Component {
  render() {
    const {url} = this.props.match;
    build_context_url_tree(AppContext, url);

    return (
      <ThemeProvider theme={themes[themeConfig.theme]}>
        <AppHolder>
            <UserContext.Provider value={this.props.userContext}>

              <NavigationContext.Provider rootContext={AppContext}>
                <Layout style={{height: '100vh'}}>
                  <Debounce time="1000" handler="onResize">
                    <WindowResizeListener
                      onResize={windowSize =>
                        this.props.toggleAll(
                          windowSize.windowWidth,
                          windowSize.windowHeight
                        )}
                    />
                  </Debounce>
                  <Topbar url={url}/>
                  <Layout style={{flexDirection: 'row', overflowX: 'hidden'}}>
                    <Sidebar url={url}/>
                    <Layout
                      className="isoContentMainLayout"
                      style={{
                        height: '100vh'
                      }}
                    >
                      <Content
                        className="isomorphicContent"
                        style={{
                          padding: '70px 0 0 0',
                          flexShrink: '0',
                          background: '#f1f3f6',
                          height: '94vh'
                        }}
                      >
                        <LayoutWrapper id="app-content-area" className="app-content-wrapper">
                          <DashboardControlBar/>
                          <div className={"app-content"}>
                            <AppRouter url={url} {...this.props} />
                          </div>
                        </LayoutWrapper>
                      </Content>
                      <Footer
                        style={{
                          textAlign: 'center',
                          height: '5vh',
                        }}
                      >
                        {siteConfig.footerText}
                      </Footer>
                    </Layout>
                  </Layout>
                </Layout>
              </NavigationContext.Provider>

            </UserContext.Provider>
        </AppHolder>
      </ThemeProvider>
    );
  }
}

export default connect(
  state => ({
    auth: state.Auth,
    userContext: state.user,
  }),
  {logout, toggleAll}
)(App);
