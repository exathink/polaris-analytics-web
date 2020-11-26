import Contributors from "../../contributors/context";
import Repositories from "../../repositories/context";
import WorkItems from "../../work_items/context";


export function navigateToContext(context, childContext, name, key) {
  switch (childContext) {
    case 'author':
    case 'committer':
    case 'contributor': {
      context.navigate(Contributors, name, key);
      break;
    }
    case 'repository': {
      context.navigate(Repositories, name, key);
      break;
    }
    case 'workItem': {
      context.navigate(WorkItems, name, key)
      break;
    }
    default: {
      break
    }
  }
}

export function navigateToPullRequest(webUrl) {
  window.open(webUrl, "_blank");
}