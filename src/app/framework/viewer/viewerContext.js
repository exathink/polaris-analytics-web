import React from 'react';
import {analytics_service} from "../../services/graphql";
import gql from "graphql-tag";
import {withRouter} from "react-router";


const {Provider, Consumer} = React.createContext({})

class ViewerContextProvider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      viewer: null
    }
  }

  async componentDidMount() {
    try {
      const result = await analytics_service.query({
        query: gql`
            query viewer_info {
                viewer {
                    userName
                    firstName
                    lastName
                    email
                    roles
                    accountKey
                    account {
                        key
                        name
                    }
                }
            }`

      })
      if (result.data != null) {
        this.setState({
          viewer: result.data.viewer
        })
      }
    } catch(error) {
      this.setState({
        ...this.state,
        error: error
      })
    }
  }

  render() {
    return (
      this.state.viewer != null ?
        <Provider value={this.state.viewer}>
          {this.props.children}
        </Provider>
        : this.state.error != null ?
          "Unknown user error"
        : null
    )
  }

}

export const ViewerContext = {
  Provider: ViewerContextProvider,
  Consumer: Consumer
};

export const withViewerContext = Component => (
  props =>
    <ViewerContext.Consumer>
      {
        viewer =>
          <Component
            viewer={viewer}
            {...props}/>
      }
    </ViewerContext.Consumer>
);