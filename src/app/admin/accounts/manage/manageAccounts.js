import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import gql from "graphql-tag";
import {Mutation} from "react-apollo";
import {AddAccountForm} from "./addAccountForm";
import {AllAccountsTableWidget} from "./allAccountsTable";
import {withSubmissionCache} from "../../../components/forms/withSubmissionCache";

const CREATE_ACCOUNT = gql`
    mutation createAccount ($createAccountInput: CreateAccountInput!){
        createAccount(createAccountInput: $createAccountInput){
            account {
                id
                name
                key
            }
        }
    }
`

export const ManageAccounts = (
  {
    submissionCache: {
      submit,
      lastSubmission
    }
  }) => (
  <Mutation mutation={CREATE_ACCOUNT}>
    {
      (createAccount, {data, loading, error}) => {
        return (
          <Dashboard h={"100%"}>
            <DashboardRow
              title={"All Accounts"}
              controls={[
                () =>
                  <AddAccountForm
                    onSubmit={
                      submit(
                        values => createAccount({
                          variables: {
                            createAccountInput: {
                              name: values.accountName,
                              profile: {
                                defaultWorkTracking: values.accountWorkTracking
                              },
                              defaultOrganization: {
                                name: values.organizationName,
                                profile: {
                                  defaultWorkTracking: values.organizationWorkTracking
                                }
                              },
                              accountOwnerInfo: {
                                firstName: values.firstName,
                                lastName: values.lastName,
                                email: values.email

                              }
                            }
                          }
                        })
                      )
                    }
                    loading={loading}
                    error={error}
                    lastSubmission={lastSubmission}
                  />
              ]}
            >
              <DashboardWidget
                name={'table'}
                w={1}
                showDetail={true}
                render={() => <AllAccountsTableWidget newData={data? data.createAccount: null}/>}
              />
            </DashboardRow>
          </Dashboard>
        )
      }
    }
  </Mutation>
)

export default withSubmissionCache(ManageAccounts)


