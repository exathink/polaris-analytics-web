/*
 * Copyright (c) Exathink, LLC  2016-2023.
 * All rights reserved
 *
 */
import { ProjectDashboard } from "../../projectDashboard";
import {FLOW_DASHBOARD_NEW_LAYOUT} from "../../../../../config/featureFlags";
import {withViewerContext} from "../../../../framework/viewer/viewerContext";
import { NewFlowDashboard  as ClassicLayoutDashboard} from "./classic_layout_dashboard";
import { NewFlowDashboard  as NewLayoutDashboard} from "./new_layout_dashboard";

export default withViewerContext(({viewerContext}) => (
  <ProjectDashboard pollInterval={1000 * 60}>
    {
      viewerContext.isFeatureFlagActive(FLOW_DASHBOARD_NEW_LAYOUT) ?
      <NewLayoutDashboard /> :
      <ClassicLayoutDashboard/>
    }
  </ProjectDashboard>
));