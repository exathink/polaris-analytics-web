
import LayoutWrapper from '../../components/utility/layoutWrapper';
import React from "react";
import {contextRouterFor} from "../framework/navigation/context/contextRouter";
import ContextManager from "../framework/navigation/components/contextManager";
import Dashboard from "./context";

const DashboardRouter = contextRouterFor(Dashboard);




const DashboardContainer = (props: any) => (
  <LayoutWrapper id="dashboard" className="dashboard-wrapper">
    <ContextManager rootContext={Dashboard} {...props}/>
    <DashboardControlBar/>
    <div className="dashboard-vizzes">
      <DashboardRouter {...props} />
    </div>
  </LayoutWrapper>
);
export default DashboardContainer;