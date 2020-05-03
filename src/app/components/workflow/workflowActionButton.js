import React from 'react';
import Button from "../../../components/uielements/button";
import "./steps.css";

export const WorkflowActionButton = ({children, disabled,  ...rest}) => (
  <Button
    size={'small'}
    type="primary"
    shape={'circle'}
    style={!disabled ? {backgroundColor: '#7824b5', borderColor: '#7824b5'} : {}}
    disabled={disabled}
    {...rest}>
    {children}
  </Button>
)