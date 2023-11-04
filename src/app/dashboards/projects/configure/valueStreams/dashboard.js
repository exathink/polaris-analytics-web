/*
 * Copyright (c) Exathink, LLC  2016-2023.
 * All rights reserved
 *
 */

import { ProjectDashboard } from "../../projectDashboard";
import {ValueStreamWorkStreamEditorDashboard} from "../dashboard";
import React from "react";

const dashboard = (({viewerContext}) => (
  <ProjectDashboard>
    <ValueStreamWorkStreamEditorDashboard/>
  </ProjectDashboard>
));

export default dashboard;