import React, {useState} from "react";
import {Drawer, Button} from "antd";

export const InfoDrawer = ({title, content}) => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };
  return (
    <div>
      <Button onClick={showDrawer}>
        More..
      </Button>
      <Drawer title={title} placement="right" closable={false} onClose={onClose} visible={visible}>
        {content}
      </Drawer>
    </div>
  );
};