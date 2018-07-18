import {withRouter} from "react-router";
import {withDetailRoutes} from "./withDetailRoutes";
import {injectIntl} from "react-intl";
import {DashboardLayout} from "./dashboardLayout";

export const Dashboard = withRouter(withDetailRoutes(injectIntl(DashboardLayout)));