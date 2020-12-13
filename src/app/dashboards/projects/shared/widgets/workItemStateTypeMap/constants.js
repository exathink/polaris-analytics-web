export const actionTypes = {
    REPLACE_WORKITEM_SOURCE: "REPLACE_WORKITEM_SOURCE",
    UPDATE_WORKITEM_SOURCE: "UPDATE_WORKITEM_SOURCE",
    CANCEL_EDIT_MODE: "CANCEL_EDIT_MODE",
    MUTATION_SUCCESS: "MUTATION_SUCCESS",
    SHOW_UNMAPPED_ERROR: "SHOW_UNMAPPED_ERROR",
  };
  
  // mini state machine to handle states for button and alert controls
  export const mode = {
    INIT: "INIT",
    EDITING: "EDITING",
    SUCCESS: "SUCCESS",
    UNMAPPED_ERROR: "UNMAPPED_ERROR",
  };
  