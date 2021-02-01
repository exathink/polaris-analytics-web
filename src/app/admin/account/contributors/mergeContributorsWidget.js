import React from "react";
import {DashboardWidget} from "../../../framework/viz/dashboard";
import {Button, Icon} from "antd";
import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";

export const MergeContributorsWidget = withNavigationContext(({w, name, context}) => {
  return (
    <DashboardWidget
      name={name}
      w={w}
      title="Contributors"
      controls={[
        () => (
          <Button type="primary" onClick={() => context.go(".", "merge-contributors")}>
            <Icon type="plus" /> {`Merge Contributors`}
          </Button>
        ),
      ]}
      render={({view, context}) => <div></div>}
    />
  );
});
