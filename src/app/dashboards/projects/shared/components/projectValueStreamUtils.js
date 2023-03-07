import {capitalize} from "lodash";
import React from "react";
import {useHistory, useLocation} from "react-router-dom";
import {useWidget, WidgetCore} from "../../../../framework/viz/dashboard/widgetCore";
import {SelectDropdown, useSelect} from "../../../shared/components/select/selectDropdown";
import {useQueryProjectValueStreams} from "../hooks/useQueryValueStreams";

const defaultItem = {key: "all", name: "All"};
export function ValueStreamsDropdown() {
  const {data} = useWidget();
  const location = useLocation();

  let history = useHistory();

  const nodes = data.project.valueStreams.edges.map((edge) => edge.node);
  const items = nodes.map((node) => ({key: node.key, name: capitalize(node.name), workItemSelectors: node.workItemSelectors}));
  const uniqueItems = [defaultItem, ...items];
  const {handleChange, valueIndex} = useSelect({uniqueItems, defaultVal: defaultItem});

  React.useEffect(() => {
    if (valueIndex === 0) {
      history.push({search: ""});
    } else {
      history.push({search: `?vs=${uniqueItems[valueIndex].key}`, state: uniqueItems[valueIndex]});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, valueIndex]);

  return (
    <div className="tw-ml-2">
      <SelectDropdown uniqueItems={uniqueItems} handleChange={handleChange} />
    </div>
  );
}

export function ProjectValueStreamsWidget({context}) {
  const instanceKey = context.getInstanceKey("project");
  const result = useQueryProjectValueStreams({instanceKey});

  return (
    <WidgetCore result={result} errorContext="ValueStreamsWidget.useQueryValueStreams">
      <ValueStreamsDropdown />
    </WidgetCore>
  );
}
