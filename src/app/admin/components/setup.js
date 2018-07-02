import React from 'react';
import {graphql, QueryRenderer} from 'react-relay';
import Relay from '../../relay/environment';


export class Setup extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={Relay}
        query={graphql`
          query setupOrganizationQuery{
            organizations {
              edges {
                node {
                    name
                    repoCount
                }
              }
            }
          }
        `}
        variables={{}}
        render={({error, props}) => {
          if (error) {
            return <div>Error!</div>;
          }
          if (!props) {
            return <div>Loading...</div>;
          }
          return <div></div>;
        }}
      />
    );
  }
}