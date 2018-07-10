import React from 'react';
import AppContext from './context';
import {contextRouterFor} from "./framework/navigation/context/contextRouter";


const appRouter =  contextRouterFor(AppContext);




export default appRouter;