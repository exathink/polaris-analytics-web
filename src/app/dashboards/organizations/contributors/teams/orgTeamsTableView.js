import React from "react";
import {OrgTeamsTable} from "./orgTeamsTable";

export function OrgTeamsTableView({data}) {
  const teamsData = React.useMemo(() => {
    const edges = data?.["organization"]?.["teams"]?.["edges"] ?? [];
    return edges.map((edge) => edge.node);
  }, [data]);

  return <OrgTeamsTable tableData={teamsData} />;
}
