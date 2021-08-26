import React from "react";
import {Drawer} from "antd";

export function InfoWithDrawer({children, showPanel, setShowPanel, drawerOptions = {}}) {
    return (
      <Drawer
        placement="right"
        width={580}
        closable={false}
        onClose={() => setShowPanel(false)}
        visible={showPanel}
        {...drawerOptions}
      >
        {children}
      </Drawer>
    );
}