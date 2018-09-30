import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {
  DimensionCumulativeCommitCountWidget
} from "../../shared/widgets/accountHierarchy";
import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";

const dashboard_id = 'dashboards.history.contributors.instance';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Repository History'/>
};


export const dashboard = withNavigationContext(({match, context, ...rest}) => (
    <Dashboard dashboard={`${dashboard_id}`} {...rest}>
      <DashboardRow h={"100%"}>
        <DashboardWidget
          w={1}
          name="cumulative-commit-count"
          render={
            (view) =>
              <DimensionCumulativeCommitCountWidget
                dimension={'contributor'}
                instanceKey={context.getInstanceKey('contributor')}
                context={context}
                view={view}
              />
          }
          showDetail={true}
        />
      </DashboardRow>
    </Dashboard>
  )
);
export default dashboard;

