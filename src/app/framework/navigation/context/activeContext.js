import type {Context, MatchType, RouteType} from "./context";
import {encodeInstance, getInstanceKey} from "./helpers";

export class ActiveContext {
  context: Context;
  selectedRoute: RouteType;
  matchInfo: MatchType;
  targetUrl: string;
  search: string;
  rootUrl: string;
  rootContext: Context;
  navigator: {};


  constructor(context: Context, index: number, match: MatchType, location: { pathname: string, search: string }) {
    this.context = context;
    this.selectedRoute = context.routes[index];
    this.matchInfo = match;
    this.targetUrl = location.pathname;
    this.search = location.search;
    this.rootUrl = null;
    this.rootContext = null;
    this.navigator = null;
  }

  name() {
    return this.context.name;
  }

  display() {
    return this.context.display ? this.context.display(this.matchInfo) : '';
  }

  color() {
    return this.context.color;
  }

  icon() {
    return this.context.icon;
  }

  routes() {
    return this.context.routes;
  }

  match() {
    return `${this.selectedRoute.match}`
  }

  matchUrl() {
    return `${this.matchInfo.url}/${this.match()}`
  }

  params() {
    return this.matchInfo.params;
  }


  urlFor(route: RouteType) {
    return `${this.matchInfo.url}/${route.match}`;
  }

  equals(other: ActiveContext) {
    return other && this.targetUrl === other.targetUrl && this.context === other.context
  }

  searchParams() {
    if (this.search) {
      const query = this.search.substr(1);
      const result = {};
      query.split("&").forEach(function (part) {
        const item = part.split("=");
        result[item[0]] = decodeURIComponent(item[1]);
      });
      return result;
    }
  }

  getInstanceKey(contextName) {
    return getInstanceKey(contextName, this.params());
  }

  navigate(context, instanceName, instanceKey, topic) {
    if(this.navigator) {
      const targetPath = `${this.rootUrl}/${context.name}/${encodeInstance(instanceName, instanceKey)}/${topic}`;
      this.navigator.push(targetPath);
    }
  }

  drillDown(context, instanceName, instanceKey) {
    const selectedTopic = this.selectedRoute.topic;
    this.navigate(context, instanceName, instanceKey, selectedTopic? selectedTopic.name : '');
  }




}