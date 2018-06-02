import {uuidEncode, uuidDecode} from "../../../helpers/uuid";

export const instanceMatchPattern = (contextName) => `:${contextName}/:${contextName}_key`;
export const encodeInstance =  (name, key) => `${name}/${uuidEncode(key)}`;
export const getInstanceKey  = (contextName, params) =>  uuidDecode(params[`${contextName}_key`]);