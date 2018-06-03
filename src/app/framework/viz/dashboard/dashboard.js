import {withRouter} from "react-router";
import {withNavigation} from "../../navigation/context/withNavigation";
import {withDetailRoutes} from "./withDetailRoutes";
import {injectIntl} from "react-intl";
import {DashboardLayout} from "./dashboardLayout";

export const Dashboard = withRouter(withNavigation(withDetailRoutes(injectIntl(DashboardLayout))));