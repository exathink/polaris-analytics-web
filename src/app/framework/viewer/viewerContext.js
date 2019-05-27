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

  async loadViewerInfo() {
    try {
      const result = await analytics_service.query({
        query: gql`
            query viewer_info {
                viewer {
                    ...ViewerInfoFields
                }
            }
            ${ViewerContext.fragments.viewerInfoFields}
        `
      })
      if (result.data != null) {
        this.setState({
          viewer: result.data.viewer
        })
      }
    } catch (error) {
      this.setState({
        ...this.state,
        error: error
      })
    }
  }

  async componentDidMount() {
    this.loadViewerInfo()
  }

  async refresh() {
    this.loadViewerInfo()
  }

  render() {
    return (
      this.state.viewer != null ?
        <Provider value={{
          viewer: this.state.viewer,
          refresh: this.refresh.bind(this)
        }}>
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
  Consumer: Consumer,

  fragments: {
    viewerInfoFields: gql`
        fragment ViewerInfoFields on Viewer {
            userName
            company
            firstName
            lastName
            email
            roles
            accountKey
            account {
                id
                key
                name
                organizations(summariesOnly: true) {
                    count
                }
                projects(summariesOnly: true){
                    count
                }
                repositories(summariesOnly: true){
                    count
                }
            }
        }
    `
  },
  queries: {}
};

export const withViewerContext = (Component, allowedRoles=null) => (
  props =>
    <ViewerContext.Consumer>
      {
        viewerContext =>
          allowedRoles == null || verifyRoles(viewerContext.viewer, allowedRoles) ?
            <Component
              viewerContext={viewerContext}
              {...props}/>
            :'Access Denied'
      }
    </ViewerContext.Consumer>
);

export function verifyRoles(viewer, roles) {
  return roles? roles.some(role => viewer.roles.indexOf(role) != -1) : true
}

