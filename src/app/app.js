import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Layout, Spin} from 'antd';
import {Debounce} from 'react-throttle';
import WindowResizeListener from 'react-window-size-listener';
import {ThemeProvider} from 'styled-components';
import appActions from '../redux/app/actions';
import Sidebar from './containers/sidebar/sidebar';
import Topbar from './containers/topbar/topbar';
import {AppRouter} from './appRouter';
import {siteConfig} from '../config.js';
import themes from '../config/themes/index';
import {themeConfig} from '../config';
import AppHolder from './commonStyle';
import './global.css';
import './framework/viz/dashboard/dashboard.css';
import LayoutWrapper from '../components/utility/layoutWrapper';
import AppContext from './context';
import {build_context_url_tree} from "./framework/navigation/context/helpers";
import {NavigationContext} from "./framework/navigation/context/navigationContext";
import {DashboardControlBar} from "./containers/controlbar/controlbar";


const {Content, Footer} = Layout;
const {toggleAll} = appActions;

export class App extends Component {
  render() {
    const {url} = this.props.match;
    build_context_url_tree(AppContext, url);

    return (
      <ThemeProvider theme={themes[themeConfig.theme]}>
        <AppHolder>
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
              <Topbar url={url} />
              <Layout style={{flexDirection: 'row', overflowX: 'hidden'}}>
                <Sidebar url={url} />
                <Layout
                  className="isoContentMainLayout"
                  style={{
                    height: '100vh'
                  }}
                >
                  <Content
                    className="isomorphicContent"
                    style={{
                      padding: '56px 0 0 0',
                      flexShrink: '0',
                      background: '#f1f3f6',
                      height: '94vh'
                    }}
                  >
                    <LayoutWrapper id="app-content-area" className="app-content-wrapper">

                      <div className={"app-content"}>
                        <DashboardControlBar/>
                        <React.Suspense fallback={<Spin/>}>
                          <AppRouter url={url} {...this.props} />
                        </React.Suspense>
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
        </AppHolder>
      </ThemeProvider>
    );
  }
}

export default connect(
  null,
  {toggleAll}
)(App);
