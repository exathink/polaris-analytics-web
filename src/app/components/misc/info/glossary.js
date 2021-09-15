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
  CARDS: (
    <TermDefinition
      name={"cards"}
      definition={"Generic term in Polaris for tickets, issues, work items etc. in your work tracking system."}
    />
  ),
  CYCLE_TIME: (
    <TermDefinition
      name={"cycle time"}
      definition={"The cumulative time a card spent in Open, Make and Deliver phases during a delivery cycle."}
    />
  ),

  DELIVERY_CYCLES: (
    <TermDefinition
      name={"delivery cycles"}
      definition={"A delivery cycle starts when a card transitions to an active phase and completes when it transitions to the Closed phase. A card can have " +
      "many delivery cycles. See Model:Delivery Process Mapping for more details."}
      />
  ),
  DELIVERY_PROCESS_MAPPING: (
    <TermDefinition
      name={"delivery process mapping"}
      definition={
        "A mapping of workflow states in your work tracking system into standard phases. See Model:Delivery Process Mapping."
      }
    />
  ),
  FLOW_ANALYSIS_PERIOD: (
    <TermDefinition
      name={"flow analysis period"}
      definition={
        "The rolling time window used to measure throughput and response time for the value stream. See Model:Measurement Settings."
      }
    />
  ),
  LEAD_TIME: (
    <TermDefinition
      name={"lead time"}
      definition={"The cumulative time a card spent in the Define, Open, Make and Deliver phases in a delivery cycle."}
    />
  ),
  PHASE: (
    <TermDefinition
      name={"phase"}
      definition={"The five standard phases in Polaris are Define, Open, Make, Deliver and Closed. See Model:Delivery Process Mapping"}
    />
  ),
  VOLUME: (
    <TermDefinition
      name={"volume"}
      definition={"The number of delivery cycles that completed within a given interval of time"}
    />
  ),
};