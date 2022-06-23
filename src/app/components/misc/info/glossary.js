import Button from "../../../../components/uielements/button";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import React from "react";
import { capitalizeFirstLetter } from "../../../helpers/utility";
import {InfoCard} from "./infoCard";

export const Glossary = {};
const {Section} = InfoCard;

export function TermDefinition({name, definition, capitalize, append, className, inline=false}) {
  return (
    !inline  ?
    <span className={className}>
      <Tooltip title={definition}>
        <Button type={"link"} className={"tooltip"}>
          {
            capitalize ?
              capitalizeFirstLetter(name)
              :
              name
          }
          <sup>
            <InfoCircleOutlined style={{fontSize: "12px", paddingLeft: "2px"}} />
          </sup>
          {
            append
          }
        </Button>
      </Tooltip>
    </span>
      :
      <span>{definition}</span>
  );
}

/** Maintain these in alphabetical order for easy scanning */

Glossary.CARDS = ({display="cards", ...rest}) => {
  return (
    <TermDefinition
      name={display}
      definition={"Generic term in Polaris for tickets, issues, work items etc. in your work tracking system."}
      {...rest}
    />
  )
}

Glossary.SPECS = ({display="specs", ...rest}) => {
  return (
    <TermDefinition
      name={display}
      definition={"A card that has commits associated with it."}
      {...rest}
    />
  )
}


Glossary.CODING_TIME = ({display="coding time", ...rest}) => {
  return (
    <TermDefinition
      name={display}
      definition={"The elapsed time from the earliest commit to the latest commit recorded for the card."}
      {...rest}
    />
  )
}

Glossary.DELIVERY_TIME = ({display="coding time", ...rest}) => {
  return (
    <TermDefinition
      name={display}
      definition={"The elapsed time from the earliest commit to the latest commit recorded for the card."}
      {...rest}
    />
  )
}

Glossary.CYCLE_TIME = ({display="cycle time", ...rest}) => {
  return (
    <TermDefinition
      name={display}
      definition={"The time required to make and deliver the code changes for a card in a delivery cycle."}
      {...rest}
    />
  )
}

Glossary.DELIVERY_CYCLES = ({display="delivery cycles", ...rest}) => {
  return (
    <TermDefinition
      name={display}
      definition={
        "A delivery cycle starts when a card transitions to an active phase and completes when it transitions to the Closed phase. A card can have " +
        "many delivery cycles. See Model:Delivery Process Mapping for more details."
      }
      {...rest}
    />
  )
}



Glossary.DELIVERY_PROCESS_MAPPING = ({display="delivery process mapping", ...rest}) => {
  return (
    <TermDefinition
      name={display}
      definition={
        "A mapping of workflow states in your work tracking system into standard phases. See Model:Delivery Process Mapping."
      }
      {...rest}
    />
  )
}

Glossary.DELIVERY_TIME = ({display="delivery time", ...rest}) => {
  return (
    <TermDefinition
      name={display}
      definition={
      "The elapsed time from the latest commit recorded for the card to the time the card first entered a state in the closed phase." +
        "This value is set to 0 if the latest commit is recorded after the card is closed"}
      {...rest}
    />
  )
}

Glossary.FLOW_ANALYSIS_PERIOD = ({display="flow analysis period", ...rest}) => {
  return (
    <TermDefinition
      name={display}
      definition={"The rolling time window used to measure throughput and response time for the value stream. See Model:Measurement Settings."}
      {...rest}
    />
  )
}

Glossary.LEAD_TIME = ({display="lead time", ...rest}) => {
  return (
    <TermDefinition
      name={display}
      definition={"The cumulative time a card spent in the Define, Open, Make and Deliver phases in a delivery cycle."}
      {...rest}
    />
  )
}

Glossary.PHASE = ({display="phase", ...rest}) => {
  return (
    <TermDefinition
      name={display}
      definition={"The five standard phases in Polaris are Define, Open, Make, Deliver and Closed. See Model:Delivery Process Mapping"}
      {...rest}
    />
  )
}

Glossary.REVIEW_TIME = ({display="code review time", ...rest}) => {
  return (
    <TermDefinition
      name={display}
      definition={"The elapsed time from when a pull request was opened to the time it was merged or closed."}
      {...rest}
    />
  )
}
Glossary.VOLUME = ({display="volume", ...rest}) => {
  return (
    <TermDefinition
      name={display}
      definition={"The number of completed delivery cycles within a given analysis period."}
      {...rest}
    />
  )
}







