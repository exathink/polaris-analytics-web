import {uuidEncode, uuidDecode} from "../../../helpers/uuid";

export const instanceMatchPattern = (contextName) => `:${contextName}/:${contextName}_key`;
export const encodeInstance =  (name, key) => `${name}/${key}`;
export const getInstanceKey  = (contextName, params) =>  params[`${contextName}_key`];

export const url_for_instance = (context, name, key) => (
  `${context.url_for}/${encodeInstance(name,key)}`
);

export const build_context_url_tree = (context, path_to_context) => {
  context.url_for = path_to_context;
  context.routes.forEach((route) => {
    if(route.context) {
      build_context_url_tree(route.context, `${path_to_context}/${route.match}`)
    }
  });
};

