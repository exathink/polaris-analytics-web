/*
 * Copyright (c) Exathink, LLC  2016-2023.
 * All rights reserved
 *
 */

import { ProjectDashboard } from "../../projectDashboard";
import {ProjectStabilityGoalsSettingsDashboard} from "../../../shared/widgets/configure/projectSettingWidgets";
import React from "react";

const dashboard = (({viewerContext}) => (
  <ProjectDashboard>
    <ProjectStabilityGoalsSettingsDashboard/>
  </ProjectDashboard>
));

export default dashboard;