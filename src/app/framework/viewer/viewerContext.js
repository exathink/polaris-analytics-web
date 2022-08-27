import { gql } from "@apollo/client";
import React from 'react';
import {analytics_service} from "../../services/graphql";
import ReactGA from 'react-ga';


const ViewerContextRaw = React.createContext({})

class ViewerContextProvider extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      viewer: null,
      accountKey: null
    }
  }

  async loadViewerInfo() {
    try {
      const result = await analytics_service.query({
        query: gql`
            query viewer_info {
                viewer {
                    key
                    ...ViewerInfoFields
                }
            }
            ${ViewerContext.fragments.viewerInfoFields}
        `
      })
      if (result.data != null) {
        // Add the user key to Google Analytics.
        if (result.data.viewer != null) {
          ReactGA.set({userId: result.data.viewer.key})
        }
        this.setState({
          viewer: result.data.viewer,
          accountKey: result.data.viewer.accountKey
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

  // clear the cache and then rerender
  async resetStore() {
    analytics_service.resetStore().then(_ => this.forceUpdate());
  }

  isAccountOwner() {
    return this.state.viewer.accountRoles.find(
      scopedRole =>
        scopedRole.scopeKey === this.state.viewer.accountKey &&
        scopedRole.role === 'owner'
    )
  }

  isAdmin() {
    return this.hasSystemRoles(['admin'])
  }

  hasSystemRoles(roles) {
    if (roles != null) {
      let found = false;
      for (let i=0; i < roles.length && !found; i++) {
        const role = roles[i];
        if (role === 'account-owner') {
          found = this.isAccountOwner()
        } else {
          found = this.state.viewer.systemRoles.indexOf(role) !== -1;
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
      const accountRole = this.state.viewer.accountRoles.find(scopedRole => scopedRole.scopeKey === accountKey)
      if (accountRole) {
        return roles.indexOf(accountRole) !== -1
      }
    } else {
      return true
    }
  }

  getViewerOrganizations(role=null) {
    const organizations = this.state.viewer.organizationRoles;
    return role != null ? organizations.filter(organization => organization.role === role) : organizations;
  }

  isOrganizationOwner(organizationKey) {
    return this.getViewerOrganizations('owner').some(organization => organization.key === organizationKey)
  }


  isFeatureFlagActive(featureFlag) {
    const userEnablement = this.state.viewer.featureFlags.edges.find(
      edge => edge.node.name === featureFlag && edge.node.enabled != null
    )
    if (userEnablement != null) {
      return userEnablement.node.enabled
    } else {
      const accountEnablement = this.state.viewer.account.featureFlags.edges.find(
        edge => edge.node.name === featureFlag && edge.node.enabled != null
      )
      if (accountEnablement != null) {
        return accountEnablement.node.enabled
      }
    }
    return false
  }

  render() {
    return (
      this.state.viewer != null &&
        <ViewerContextRaw.Provider value={{
          viewer: this.state.viewer,
          accountKey: this.state.accountKey,
          refresh: this.refresh.bind(this),
          resetStore: this.resetStore.bind(this),
          hasAccountRoles : this.hasAccountRoles.bind(this),
          hasSystemRoles: this.hasSystemRoles.bind(this),
          getViewerOrganizations: this.getViewerOrganizations.bind(this),
          isAdmin: this.isAdmin.bind(this),
          isAccountOwner: this.isAccountOwner.bind(this),
          isOrganizationOwner: this.isOrganizationOwner.bind(this),
          isFeatureFlagActive: this.isFeatureFlagActive.bind(this)
        }}>
          {this.props.children}
        </ViewerContextRaw.Provider>
    )
  }

}

export const ViewerContext = {
  Provider: ViewerContextProvider,
  Consumer: ViewerContextRaw.Consumer,

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
                key
                name
                scopeKey
                role
            }
            organizationRoles {
                key
                name
                scopeKey
                role
            }
            accountKey
            account {
                id
                key
                name
                featureFlags {
                  edges {
                    node {
                      name
                      key
                      enabled
                    }
                  }
                }
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
            featureFlags {
              edges {
                node {
                  name
                  key
                  enabled
                }
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

export function useViewerContext(){
  const context = React.useContext(ViewerContextRaw);
  if (context === undefined) {
    throw new Error('useViewerContext must be used within a Provider')
  }
  return context
}