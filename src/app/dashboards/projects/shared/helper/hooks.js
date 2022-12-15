import React from "react";
import {useIntl} from "react-intl";
import {getFlowEfficiencyUtils} from "../../../shared/widgets/work_items/clientSideFlowMetrics";
import {getPercentage} from "./utils";

export function useResetComponentState() {
  const [resetComponentStateKey, setKey] = React.useState(1);

  function resetComponentState() {
    const newKey = resetComponentStateKey === 1 ? 2 : 1;
    setKey(newKey);
  }

  return [resetComponentStateKey, resetComponentState];
}

export function useFlowEfficiency(workItems) {
  const intl = useIntl();
  const {timeInWaitState, timeInActiveState} = getFlowEfficiencyUtils(workItems);
  
  const fractionVal =
  timeInWaitState + timeInActiveState !== 0
      ? timeInActiveState / (timeInWaitState + timeInActiveState)
      : 0;

  return {timeInWaitState, timeInActiveState, flowEfficiencyPercentage: getPercentage(fractionVal, intl)};
}
