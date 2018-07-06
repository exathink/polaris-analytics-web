import React from 'react';
import gql from "graphql-tag";
import {Query, Mutation} from 'react-apollo';
import {Set} from 'immutable';


export class SelectOrganization extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false
    }
  }

  onChange(e) {
    this.setState({selected: e.target.checked})
    if (this.props.onSelectionChange) {
      this.props.onSelectionChange(this.props.organization, e.target.checked)
    }
  }

  render() {
    const {organization} = this.props;
    return (
      <React.Fragment>
        <span style={{marginRight: "10px"}}>{organization.name}</span>
        <input type='checkbox' checked={this.state.selected} onChange={this.onChange.bind(this)}/>
      </React.Fragment>
    )
  }
}

export const AvailableOrganizations = ({onSelectionChange, refresh}) => {
  return (
    <Query
      query={gql`
          {
            organizations(availableToAdd: true) {
              edges {
                node {
                    id
                    organizationKey
                    name
                    repoCount
                }
              }
            }
          }
        `}
      fetchPolicy={refresh? 'network-only' : 'cache-first'}
    >
      {
        ({loading, error, data}) => {
          if (loading) return <p> Loading.. </p>;
          if (error) return <p> Error: </p>;

          return (
            <ul>
              {
                data.organizations.edges.map(
                  edge => (
                    <li key={edge.node.id}>
                      <SelectOrganization organization={edge.node} onSelectionChange={onSelectionChange}/>
                    </li>
                  )
                )
              }
            </ul>
          );
        }
      }
    </Query>
  );
};

export const OrganizationsInAccount = ({refresh}) => (
  <Query
    query={
      gql`{
            account{
                organizations {
                  edges {
                    node {
                        id
                        name
                        repoCount
                    }
                 }
                }
            }
          }
        `}
    fetchPolicy={refresh? 'network-only' : 'cache-first'}
  >
    {
      ({loading, error, data}) => {
        if (loading) return <p> Loading.. </p>;
        if (error) return <p> Error: </p>;

        return (
          <ul>
            {
              data.account.organizations.edges.map(
                edge => (
                  <li key={edge.node.id}>{edge.node.name}</li>
                )
              )
            }
          </ul>
        );
      }
    }
  </Query>
);


const ADD_ORGANIZATIONS = gql`
    mutation addOrganizations($organizationKeys: [String]! ) {
        addOrganizations(organizationKeys: $organizationKeys) {
            ok
        }
    }
`;

export class AddOrganization extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selections: Set()
    }
  }

  onSelectionChange(organization, selected) {
    if (selected) {
      this.setState({selections: this.state.selections.add(organization)})
    } else {
      this.setState({selections: this.state.selections.delete(organization)})
    }
  }


  render() {
    return (
      <Mutation mutation={ADD_ORGANIZATIONS}>
        {
          (addOrganizations, {data}) => {
            const needsRefresh = data ? data.addOrganizations.ok : false;

            return (
              <form
                onSubmit={event => {
                  event.preventDefault();
                  if (this.state.selections.size > 0) {
                    addOrganizations({variables: {organizationKeys: this.state.selections.map(organization => organization.organizationKey)}})
                  }
                }}
              >
                <div>
                  <h3>Available Organizations</h3>
                  <AvailableOrganizations onSelectionChange={this.onSelectionChange.bind(this)} refresh={needsRefresh}/>
                  <h3>Current Organizations</h3>
                  <OrganizationsInAccount refresh={needsRefresh}/>
                  <input type="submit" value={"submit"}/>
                </div>
              </form>
            );
          }
        }
      </Mutation>
    );
  }
}



