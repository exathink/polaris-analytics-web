import React from "react";
import {OrgTeamsTable} from "./orgTeamsTable";

export function OrgTeamsTableView({data, days, measurementWindow, samplingFrequency, organizationKey, specsOnly}) {
  const teamsData = React.useMemo(() => {
    const edges = data?.["organization"]?.["teams"]?.["edges"] ?? [];
    return edges.map((edge) => edge.node);
  }, [data]);

  return <OrgTeamsTable tableData={teamsData} days={days} samplingFrequency={samplingFrequency} organizationKey={organizationKey} specsOnly={specsOnly}/>;
}
