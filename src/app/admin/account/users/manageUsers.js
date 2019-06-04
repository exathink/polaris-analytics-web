import React from 'react';
import {DashboardWidget} from "../../../framework/viz/dashboard";
import gql from "graphql-tag";
import {Mutation} from "react-apollo";
import {withSubmissionCache} from "../../../components/forms/withSubmissionCache";
import {AccountUsersTableWidget} from "./accountUsersTable";
import {InviteUserForm} from "./inviteUserForm";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {openNotification} from "../../../helpers/utility";

const INVITE_USER = gql`
    mutation inviteUser ($inviteUserInput: InviteUserInput!){
        inviteUser(inviteUserInput: $inviteUserInput){
            user {
                id
                name
                key
            }
            created
            inviteSent
        }
    }
`

function notify(data) {
  if (data != null && data.inviteUser) {
    if(data.inviteUser.created) {
     openNotification('success', `User ${data.inviteUser.user.name} was created and invited to your account`)
    } else if(data.inviteUser.inviteSent) {
      openNotification('success', `Existing user ${data.inviteUser.user.name} was invited to your account`)
    }
  }
}

const ManageUsers = withViewerContext((
  {
    name,
    w,
    viewerContext: {viewer},
    submissionCache: {
      submit,
      lastSubmission
    },
    ...rest
  }) => (
  <Mutation mutation={INVITE_USER}>
    {
      (inviteUser, {data, loading, error}) => {
        notify(data)
        return (
          <DashboardWidget
            name={name}
            w={w || 1}
            title={"Users"}
            showDetail={true}
            controls={[
              () =>
                  <InviteUserForm
                    onSubmit={
                      submit(
                        values => inviteUser({
                          variables: {
                            inviteUserInput: {
                              accountKey: viewer.account.key,
                              email: values.email,
                              firstName: values.firstName,
                              lastName: values.lastName,
                              organizations: values.organizations
                            }
                          }
                        })
                      )
                    }
                    loading={loading}
                    error={error}
                    values={lastSubmission}
                  />
            ]}
            render={({view}) => <AccountUsersTableWidget view={view} newData={data ? data.inviteUser : null}/>}
            {...rest}
          />
        )
      }
    }
  </Mutation>
))

export const ManageUsersDashboardWidget = withSubmissionCache(ManageUsers)