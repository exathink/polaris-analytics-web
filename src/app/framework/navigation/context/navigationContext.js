import React from 'react';
import {findActiveContext} from "../context/contextPath";

import {withRouter} from "react-router";
import {withViewerContext} from "../../viewer/viewerContext";
import {ContextStack} from './contextStack';
import {VIDEO_GUIDANCE} from "../../../../config/featureFlags";

const {Provider, Consumer} = React.createContext({});



class NavigationContextProvider extends React.Component {
  constructor(props) {
    super(props);
    const {viewerContext} = props;
    this.state = {
      location: null,
      contextStack: ContextStack.initContext(),
      filteredTopics: null,
      navigate: props.history,
      filterTopics: this.filterTopics.bind(this),
      showOptionalTopics: this.showOptionalTopics.bind(this),
      setPolling: this.setPolling.bind(this),
      polling: false,
      enableVideo: viewerContext.isFeatureFlagActive(VIDEO_GUIDANCE),
      setEnableVideo: this.setEnableVideo.bind(this),
      activeDashboardVideoConfig: undefined,
      setActiveDashboardVideoConfig: this.setActiveDashboardVideoConfig.bind(this),
      fullScreen: false,
      setFullScreen: this.setFullScreen.bind(this),
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.location !== nextProps.location) {
      const activeContext = findActiveContext(nextProps.rootContext, nextProps.location, nextProps.match);
      activeContext.rootContext = nextProps.rootContext;
      activeContext.rootUrl = nextProps.match.url;
      activeContext.navigator = nextProps.history;
      return {
        ...prevState,
        location: nextProps.location,
        contextStack: ContextStack.pushContext(prevState.contextStack, activeContext),
        filteredTopics: null,
        optionalTopics: null
      }
    } else {
      return null;
    }
  }

  filterTopics(filteredTopics) {
    this.setState({
      ...this.state,
      filteredTopics: filteredTopics
    })
  }

  setPolling(polling){
    this.setState({
      ...this.state,
      polling: polling
    })
  }

  setEnableVideo(enableVideo){
    this.setState({
      ...this.state,
      enableVideo: enableVideo
    })
  }

  setActiveDashboardVideoConfig(activeDashboardVideoConfig){
    this.setState({
      ...this.state,
      activeDashboardVideoConfig: activeDashboardVideoConfig
    })
  }
  
  setFullScreen(fullScreen){
    this.setState({
      ...this.state,
      fullScreen: fullScreen
    })
  }

  showOptionalTopics(optionalTopics) {
    this.setState({
      ...this.state,
      optionalTopics: optionalTopics
    })
  }


  render() {
    return (
      <Provider value={this.state}>
        {this.props.children}
      </Provider>
    )
  }
}



export const NavigationContext = {
  Provider: withViewerContext(withRouter(NavigationContextProvider)),
  Consumer: Consumer
};

