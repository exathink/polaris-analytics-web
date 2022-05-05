import {Dashboard, DashboardRow, DashboardWidget} from "../../../../framework/viz/dashboard";
import { RepositoriesEditTableWidget } from "./repositoriesEditTableWidget";
const dashboard_id = "dashboards.activity.dimension.instance";

export function RepositoriesDetailDashboard({dimension, instanceKey, view}) {
  return (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow h={"100%"}>
        <DashboardWidget
          w={1}
          name="repositories-detail"
          render={({view}) => <RepositoriesEditTableWidget dimension={dimension} instanceKey={instanceKey} view={view} />}
          showDetail={false}
        />
      </DashboardRow>
    </Dashboard>
  );
}
