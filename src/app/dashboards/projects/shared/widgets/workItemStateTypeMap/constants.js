export const actionTypes = {
  REPLACE_WORKITEM_SOURCE: "REPLACE_WORKITEM_SOURCE",
  UPDATE_WORKITEM_SOURCE: "UPDATE_WORKITEM_SOURCE",
  CANCEL_EDIT_MODE: "CANCEL_EDIT_MODE",
  MUTATION_SUCCESS: "MUTATION_SUCCESS",
  MUTATION_SUCCESS_WITH_REBUILD: "MUTATION_SUCCESS_WITH_REBUILD",
  MUTATION_FAILURE: "MUTATION_FAILURE",
  SHOW_UNMAPPED_ERROR: "SHOW_UNMAPPED_ERROR",
  UPDATE_FLOW_TYPE: "UPDATE_FLOW_TYPE",
  UPDATE_RELEASE_STATUS: "UPDATE_RELEASE_STATUS",
  RESET_FLOW_TYPE_RECORDS: "RESET_FLOW_TYPE_RECORDS",
  RESET_RELEASE_STATUS_RECORDS: "RESET_RELEASE_STATUS_RECORDS"
};

// mini state machine to handle states for button and alert controls
export const mode = {
  INIT: "INIT",
  EDITING: "EDITING",
  SUCCESS: "SUCCESS",
  SUCCESS_WITH_REBUILD: "SUCCESS_WITH_REBUILD",
  FAILURE: "FAILURE",
  UNMAPPED_ERROR: "UNMAPPED_ERROR",
};
