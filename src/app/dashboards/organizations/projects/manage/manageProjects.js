import React from 'react';
import {DashboardWidget} from "../../../../framework/viz/dashboard";
import gql from "graphql-tag";
import {Mutation} from "react-apollo";
import {ConfigureSourceForm} from "./configureSourceForm";
import {ProjectsTableWidget} from "./projectsTable";
import {withSubmissionCache} from "../../../../components/forms/withSubmissionCache";

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

export const ManageProjects = (
  {
    w,
    organizationKey,
    submissionCache: {
      submit,
      lastSubmission
    },
    ...rest
  }) => (
  <Mutation mutation={CREATE_ACCOUNT}>
    {
      (createAccount, {data, loading, error}) => {
        return (
            <DashboardWidget
              name={'projects'}
              title={"Projects"}
              w={w}
              controls={[
                () =>
                  <ConfigureSourceForm
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
              showDetail={false}
              render={() => <ProjectsTableWidget organizationKey={organizationKey} newData={data ? data.createProject : null}/>}
              {...rest}
            />
        )
      }
    }
  </Mutation>
)

export default withSubmissionCache(ManageProjects)


