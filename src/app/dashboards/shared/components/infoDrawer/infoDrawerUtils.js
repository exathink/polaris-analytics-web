import React from "react";
import {Drawer} from "antd";

export function InfoWithDrawer({children, showPanel, setShowPanel, drawerOptions = {}}) {
    return (
      <Drawer
        placement="top"
        height={350}
        closable={false}
        onClose={() => setShowPanel(false)}
        visible={showPanel}
        {...drawerOptions}
      >
        {children}
      </Drawer>
    );
}