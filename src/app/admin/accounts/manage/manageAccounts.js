import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import gql from "graphql-tag";
import {Mutation} from "react-apollo";
import {AddAccountForm} from "./addAccountForm";
import {AllAccountsTableWidget} from "./allAccountsTable";
import Notification from "../../../../components/notification";

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
  state = {values: null}

  submitWrapper(submit) {
    return (values) => {
      submit(values);
      this.setState({values})
    }
  }

  render() {
    return (
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
                          this.submitWrapper(
                            values => createAccount({
                              variables: {
                                createAccountInput: {
                                  company: values.company
                                }
                              }
                            })
                          )
                        }
                        values={this.state.values}
                        loading={loading}
                        error={error}
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
        }
      </Mutation>
    );
  }
}




