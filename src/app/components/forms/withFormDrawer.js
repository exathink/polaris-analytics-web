import React from "react";
import Button from "../../../components/uielements/button";
import {Drawer, Form, Icon, Select} from "antd";
import {withSubmissionHandler} from "./withSubmissionHandler";

const {Option} = Select;

export function withFormDrawer(title, Form) {
  return (
    props => {
      const {
        submissionHandler: {
          visible,
          show,
          hide,
          onSubmit
        }
      } = props;

      return (
        <React.Fragment>
          <Button type="primary" onClick={show}>
            <Icon type="plus"/> New account
          </Button>
          <Drawer
            title={title}
            width={720}
            onClose={hide}
            visible={visible}
          >
            <Form {...props} />
            <div
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: '100%',
                borderTop: '1px solid #e9e9e9',
                padding: '10px 16px',
                background: '#fff',
                textAlign: 'right',
              }}
            >
              <Button tabIndex="-1" onClick={hide} style={{marginRight: 8}}>
                Cancel
              </Button>
              <Button onClick={onSubmit} type="primary">
                Submit
              </Button>
            </div>
          </Drawer>
        </React.Fragment>
      )
    }
  )
}


