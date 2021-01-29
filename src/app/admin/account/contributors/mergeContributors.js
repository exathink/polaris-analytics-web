import React from "react";
import {DashboardWidget} from "../../../framework/viz/dashboard";
import {Button} from "antd";

export function MergeContributorsWidget({w, name}) {
  return (
    <DashboardWidget
      name={name}
      w={w}
      title="Contributors"
      controls={[() => <Button type="primary">Merge Contributors</Button>]}
      render={({view}) => <div></div>}
    />
  );
}
