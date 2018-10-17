import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {
  DimensionActivitySummaryPanelWidget,
  DimensionMostActiveChildrenWidget
} from "../../shared/widgets/accountHierarchy";
import {ChildDimensionActivityProfileWidget} from "../../shared/views/activityProfile";

import {Contexts} from "../../../meta/contexts";
import Organizations from "../../organizations/context";
import Projects from "../../projects/context";
import Repositories from "../../repositories/context";

import {AccountDashboard} from "../accountDashboard";

const dashboard_id = 'dashboards.activity.account';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Account Overview'/>
};

export const dashboard = () =>(
  <AccountDashboard
   render={
     ({account, context}) => {
       const rows = (
         account.projects.count > 0 ?
           (account.organizations.count > 1 ? 3 : 1)
           : (account.organizations.count > 1 ? 2 : 1)
       );


       return (
         <Dashboard dashboard={`${dashboard_id}`}>
           <DashboardRow h='15%'>
             <DashboardWidget
               w={1}
               title={messages.topRowTitle}
               render={() => <DimensionActivitySummaryPanelWidget dimension={'account'} instanceKey={account.key}/>}
             />
           </DashboardRow>
           {
             account.organizations.count > 1 ?
               <DashboardRow h={`${66 / rows}%`} title={Contexts.organizations.display()}>
                 <DashboardWidget
                   w={1 / 2}
                   name="organizations-activity-profile"
                   render={
                     ({view}) =>
                       <ChildDimensionActivityProfileWidget
                         dimension={'account'}
                         childDimension={'organizations'}
                         instanceKey={account.key}
                         context={context}
                         childContext={Organizations}
                         enableDrillDown={true}
                         view={view}
                       />}
                   showDetail={true}
                 />
                 <DashboardWidget
                   w={1 / 2}
                   name="most-active-organizations"
                   render={
                     ({view}) =>
                       <DimensionMostActiveChildrenWidget
                         dimension={'account'}
                         instanceKey={account.key}
                         childConnection={'recentlyActiveOrganizations'}
                         context={context}
                         childContext={Organizations}
                         top={10}
                         latestCommit={account.latestCommit}
                         days={1}
                         view={view}
                       />
                   }
                   showDetail={true}
                 />
               </DashboardRow>
               : null
           }
           {
             account.projects.count > 0 ?
               <DashboardRow h={`${66 / rows}%`} title={Contexts.projects.display()}>
                 <DashboardWidget
                   w={1 / 2}
                   name="projects-activity-profile"
                   render={
                     ({view}) =>
                       <ChildDimensionActivityProfileWidget
                         dimension={'account'}
                         childDimension={'projects'}
                         instanceKey={account.key}
                         context={context}
                         childContext={Projects}
                         enableDrillDown={true}
                         view={view}
                         pageSize={50}
                       />
                   }
                   showDetail={true}
                 />
                 <DashboardWidget
                   w={1 / 2}
                   name="most-active-projects"
                   render={
                     ({view}) =>
                       <DimensionMostActiveChildrenWidget
                         dimension={'account'}
                         instanceKey={account.key}
                         childConnection={'recentlyActiveProjects'}
                         context={context}
                         childContext={Projects}
                         top={10}
                         latestCommit={account.latestCommit}
                         days={1}
                         view={view}
                       />
                   }
                   showDetail={true}
                 />
               </DashboardRow>
               : null
           }
           <DashboardRow h={`${66/rows}%`} title={Contexts.repositories.display()}>
             <DashboardWidget
               w={1 / 2}
               name="repositories-activity-profile"
               render={
                 ({view}) =>
                   <ChildDimensionActivityProfileWidget
                     dimension={'account'}
                     childDimension={'repositories'}
                     instanceKey={account.key}
                     childContext={Repositories}
                     context={context}
                     enableDrillDown={true}
                     suppressDataLabelsAt={500}
                     view={view}
                     pageSize={50}
                   />
               }
               showDetail={true}
             />
             <DashboardWidget
               w={1 / 2}
               name="most-active-repositories"
               render={
                 ({view}) =>
                   <DimensionMostActiveChildrenWidget
                     dimension={'account'}
                     instanceKey={account.key}
                     childConnection={'recentlyActiveRepositories'}
                     context={context}
                     childContext={Repositories}
                     top={10}
                     latestCommit={account.latestCommit}
                     days={1}
                     view={view}
                   />
               }
               showDetail={true}
             />
           </DashboardRow>
         </Dashboard>
       )
     }
   }
  />
);
export default dashboard;