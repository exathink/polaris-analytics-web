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

  isAccountOwner() {
    return this.state.viewer.accountRoles.find(
      scopedRole =>
        scopedRole.scopeKey == this.state.viewer.accountKey &&
        scopedRole.role == 'owner'
    )
  }

  hasSystemRoles(roles) {
    if (roles != null) {
      let found = false;
      for (let i=0; i < roles.length && !found; i++) {
        const role = roles[i];
        if (role == 'account-owner') {
          found = this.isAccountOwner()
        } else {
          found = this.state.viewer.systemRoles.indexOf(role) != -1;
        }
      }
      return found
    } else {
      // if no roles are provided then the assumption is that this guard will pass.
      return true
    }
  }

  hasAccountRoles (accountKey, roles){
    if (roles  != null ) {
      const accountRole = this.state.viewer.accountRoles.find(scopedRole => scopedRole.scopeKey == accountKey)
      if (accountRole) {
        return roles.indexOf(accountRole) != -1
      }
    } else {
      return true
    }
  }


  render() {
    return (
      this.state.viewer != null ?
        <Provider value={{
          viewer: this.state.viewer,
          refresh: this.refresh.bind(this),
          hasAccountRoles : this.hasAccountRoles.bind(this),
          hasSystemRoles: this.hasSystemRoles.bind(this)
        }}>
          {this.props.children}
        </Provider>
        : this.state.error != null ?
        `Unknown user error: ${this.state.error}`
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
            systemRoles
            accountRoles {
                scopeKey
                role
            }
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
          viewerContext.hasSystemRoles(allowedRoles) ?
            <Component
              viewerContext={viewerContext}
              {...props}/>
            :'Access Denied'
      }
    </ViewerContext.Consumer>
);



