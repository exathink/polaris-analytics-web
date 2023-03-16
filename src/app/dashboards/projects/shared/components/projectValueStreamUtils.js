import {capitalize} from "lodash";
import React from "react";
import {useHistory, useLocation} from "react-router-dom";
import {useWidget, WidgetCore} from "../../../../framework/viz/dashboard/widgetCore";
import {SelectDropdown, useSelect} from "../../../shared/components/select/selectDropdown";
import {useQueryProjectValueStreams} from "../hooks/useQueryValueStreams";
import {useQueryParamState} from "../helper/hooks";

const defaultItem = {key: "all", name: "All", workItemSelectors: []};
let firstRender = true

export function useQueryParamSync({uniqueItems, valueIndex, updateFromQueryParam}) {
  const location = useLocation();
  const history = useHistory();

  const {queryParams} = useQueryParamState();
  const valueStreamKey = queryParams.get('vs');

  React.useEffect(() => {
    // check if we have refreshed the page, then update the dropdown from url query param.
    if (firstRender) {
      const urlSyncedItem = uniqueItems.find(item => item.key === valueStreamKey);
      if (urlSyncedItem) {
        updateFromQueryParam(urlSyncedItem);
        return;
      }
    }

    if (valueIndex === 0) {
      history.push({search: "", state: uniqueItems[valueIndex]});
    } else {
      history.push({search: `?vs=${uniqueItems[valueIndex].key}`, state: uniqueItems[valueIndex]});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, valueIndex]);

  React.useEffect(() => {
    firstRender = false
  }, []);

}

export function ValueStreamsDropdown() {
  const {data} = useWidget();

  const nodes = data.project.valueStreams.edges.map((edge) => edge.node);
  const items = nodes.map((node) => ({key: node.key, name: capitalize(node.name), workItemSelectors: node.workItemSelectors}));
  const uniqueItems = [defaultItem, ...items];
  const {handleChange, valueIndex, setSelectedVal} = useSelect({uniqueItems, defaultVal: defaultItem});

  // sync dropdown value from url query-param
  useQueryParamSync({uniqueItems, valueIndex, updateFromQueryParam: setSelectedVal})

  // when there are no value streams under project, we don't show the dropdown for valuestream
  if (items.length === 0) {
    return null;
  }
  
  return (
    <div className="tw-ml-2">
      <SelectDropdown uniqueItems={uniqueItems} handleChange={handleChange} value={valueIndex} />
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
