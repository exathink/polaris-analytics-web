import React from 'react';

import {Dashboard, DashboardRow} from "../../framework/viz/dashboard";
import AllAccounts from "./accounts/manageAccounts";

 const Landing =  () => (
  <Dashboard>
    <DashboardRow h={"30%"}>
      <AllAccounts
        name={"accounts"}
        w={"50%"}/>
    </DashboardRow>
  </Dashboard>
)

export default Landing;