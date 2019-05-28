import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../framework/viz/dashboard";
import gql from "graphql-tag";
import {Mutation} from "react-apollo";
import {withSubmissionCache} from "../../../../components/forms/withSubmissionCache";
import {AccountUsersTableWidget} from "./accountUsersTable";

const INVITE_USER = gql`
    mutation inviteUser ($inviteUserInput: InviteUserInput!){
        inviteUser(inviteUserInput: $inviteUserInput){
            user {
                id
                name
                key
            }
        }
    }
`

const ManageUsers = (
  {
    account,
    context,
    width,
    submissionCache: {
      submit,
      lastSubmission
    }
  }) => (
  <Mutation mutation={INVITE_USER}>
    {
      (inviteUser, {data, loading, error}) => {
        return (
          <DashboardWidget
            w={width || 1}
            title={"Users"}
            showDetail={true}
            render={() => <AccountUsersTableWidget account={account} newData={data ? data.inviteUser : null}/>}
          />
        )
      }
    }
  </Mutation>
)

export const ManageUsersDashboardWidget = withSubmissionCache(ManageUsers)