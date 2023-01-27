import React from "react";
import {Loading} from "../../../components/graphql/loading";
import {logGraphQlError} from "../../../components/graphql/utils";

/**
 * @typedef {import('@apollo/client').QueryResult} QueryResult
 * @typedef {import('react').ReactNode} ReactNode
 */

// not including a default value and that's intentional.
// As we do not want to render without provider and fail in that case if its there.
const WidgetContext = React.createContext();

/**
 * Consume Graphql Query result from WidgetProvider
 * @returns {QueryResult} result - The result of the GraphQL query
 */
export function useWidget() {
  const context = React.useContext(WidgetContext);
  if (context === undefined) {
    throw new Error("useWidget hook must be used within a Provider");
  }
  return context;
}
/**
 * ```
 * // this is the widget component which we write for every new query
 * import {useQueryFn} from "file-path";
 * export function SpecialWidget({children, queryVars}) {
 *   const result = useQueryHookFn(queryVars);
 * 
 *    return (
 *      <WidgetCore result={result} showLoadingError={false} errorContext="SpecialWidget.useQueryHookFn">
 *        {children}
 *      </WidgetCore>
 *    );
 *  }
 * 
 *   
 *   // ViewComponent template
 *   // No need to pass queryVars to ViewComponent as props, since they are available from useWidget() hook
 *   export function ViewComponent(props) {
 *     const {data, loading, error, variables: {dimension, specsOnly}} = useWidget();
 * 
 *     // use data and view_props to render views
 *     return <div> {data} </div>;
 *   }
 * 
 *  
 *  // Dashboard Component Template
 *  function Dashboard({}) {
 *     const [dimension, instanceKey, specsOnly, otherProp, view] = ["project", "123", true, "fine", "detail"];
 *  
 *     // This is the way to instantiate widget at the dashboard level
 *     return (
 *     <SpecialWidget queryVars={{dimension, instanceKey, specsOnly, otherProp}}>
 *            <ViewComponent />
 *        
 *           // can also be used in a nested way 
 *           <div className="">
 *            <ViewComponent />
 *           </div>
 *
 *          // handle view prop
 *           {view === "detail" && <ViewComponent />}
 *           {view === "primary" && <ViewComponent />}
 *      </SpecialWidget>
 *     );
 *   }
 * ```
 */


/**
 * @typedef {Object} WidgetCoreProps
 * @property {QueryResult} result - The result of the GraphQL query
 * @property {ReactNode} children - The children to render within the context provider
 * @property {boolean} showLoadingError - A flag indicating whether to show loading or error states
 * @property {string} errorContext - A string to indicate context of the error
 */

/**
 * Component that provides the result of a GraphQL query as context to its children
 * @param {WidgetCoreProps} props 
 */
export function WidgetCore({children, result, showLoadingError = true, errorContext = ""}) {
  if (showLoadingError) {
    if (result.loading) return <Loading />;
    if (result.error) {
      logGraphQlError(`${errorContext}`, result.error);
      return null;
    }
  }

  return <WidgetContext.Provider value={result}>{children}</WidgetContext.Provider>;
}
