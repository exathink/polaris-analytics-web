import React from 'react';
import Button from "../../../components/uielements/button";
import "./steps.css";

export const WorkflowActionButton = ({children, disabled,  ...rest}) => (
  <Button
    type="primary"
    style={!disabled ? {backgroundColor: '#7824b5', borderColor: '#7824b5'} : {}}
    disabled={disabled}
    {...rest}>
    {children}
  </Button>
)