import React from "react";
import {Drawer} from "antd";
import {CardInspectorWidget} from "./cardInspectorWidget";

export function CardInspectorWithDrawer({workItemKey, context, showPanel, setShowPanel, drawerOptions = {}}) {
  if (workItemKey) {
    return (
      <Drawer
        placement="top"
        height={355}
        closable={false}
        onClose={() => setShowPanel(false)}
        visible={showPanel}
        {...drawerOptions}
      >
        <CardInspectorWidget context={context} workItemKey={workItemKey} />
      </Drawer>
    );
  } else {
    return null;
  }
}

export function useCardInspector() {
  const [workItemKey, setWorkItemKey] = React.useState();
  const [showPanel, setShowPanel] = React.useState(false);

  return {workItemKey, setWorkItemKey, showPanel, setShowPanel};
}
