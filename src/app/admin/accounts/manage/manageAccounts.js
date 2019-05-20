import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import gql from "graphql-tag";
import {Mutation} from "react-apollo";
import {AddAccountForm} from "./addAccountForm";
import {AllAccountsTableWidget} from "./allAccountsTable";

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

export default class extends React.Component {
  render() {
    return (
      <Mutation mutation={CREATE_ACCOUNT}>
        {
          (createAccount, {data, loading, error}) => (
              <Dashboard h={"100%"}>
                <DashboardRow
                  title={"All Accounts"}
                  controls={[
                    () =>
                      <AddAccountForm
                        onSubmit={
                          values => createAccount({
                            variables: {
                              createAccountInput: {
                                company: values.company
                              }
                            }
                          })
                        }
                        loading={loading}
                      />
                  ]}
                >
                  <DashboardWidget
                    name={'table'}
                    w={1}
                    showDetail={true}
                    render={() => <AllAccountsTableWidget reload={data}/>}
                  />
                </DashboardRow>
            </Dashboard>
          )
        }
      </Mutation>
    );
  }
}




