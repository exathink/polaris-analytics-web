import React from 'react';
import Button from "../../../components/uielements/button";
import "./steps.css";

export const WorkflowActionButton = ({children, disabled,  ...rest}) => (
  <Button
    type={rest.type ?? "primary"}
    disabled={disabled}
    {...rest}>
    {children}
  </Button>
)