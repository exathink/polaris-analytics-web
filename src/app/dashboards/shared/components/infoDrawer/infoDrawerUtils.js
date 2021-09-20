import React from "react";
import {Drawer} from "antd";

export function InfoWithDrawer({children, showPanel, setShowPanel, height, drawerOptions = {}}) {
    return (
      <Drawer
        placement={drawerOptions.placement??"top"}
        height={height??400}
        closable={false}
        onClose={() => setShowPanel(false)}
        visible={showPanel}
        {...drawerOptions}
      >
        {children}
      </Drawer>
    );
}