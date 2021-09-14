import Button from "../../../../components/uielements/button";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import React from "react";

export function TermDefinition({name, definition}) {
  return (
    <Tooltip title={definition}>
      <Button type={'link'} className={'tooltip'}>  {name}  <sup> <InfoCircleOutlined style={{ fontSize: '12px' }}/> </sup></Button>
    </Tooltip>
  )
}

export const Glossary = {
  FLOW_ANALYSIS_PERIOD:
    <TermDefinition
      name={"flow analysis period"}
      definition={"The rolling time window used to measure throughput and response time for the value stream. See Model:Measurement Settings."}
    />
}