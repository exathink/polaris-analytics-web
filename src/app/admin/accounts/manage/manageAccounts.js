import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";

import {AddAccountForm} from "./addAccountForm";
import {AllAccountsTableWidget} from "./allAccountsTable";


export default class extends React.Component {
  render() {
    return (
      <Dashboard h={"100%"}>
        <DashboardRow
          title={"All Accounts"}
          controls={[
            () =>
              <AddAccountForm/>
          ]}
        >
          <DashboardWidget
            name={'table'}
            w={1}
            showDetail={true}
            render={() => <AllAccountsTableWidget/>}
          />
        </DashboardRow>
      </Dashboard>
    );
  }
}




