/*
 * Copyright (c) Exathink, LLC  2016-2023.
 * All rights reserved
 *
 */

import { ProjectDashboard } from "../../projectDashboard";
import {ValueStreamMappingDashboard} from "../dashboard";
import React from "react";

const dashboard = (({viewerContext}) => (
  <ProjectDashboard>
    <ValueStreamMappingDashboard/>
  </ProjectDashboard>
));

export default dashboard;