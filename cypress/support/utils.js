import moment from "moment";

// Utility to match GraphQL mutation based on the operation name
export const hasOperationName = (req, operationName) => {
  const {body} = req;
  return body.hasOwnProperty("operationName") && body.operationName === operationName;
};

// Alias query if operationName matches
export const aliasQuery = (req, operationName, pathToFixture) => {
  if (hasOperationName(req, operationName)) {
    req.alias = getQueryFullName(operationName);
    if (pathToFixture) {
      req.reply({
        fixture: pathToFixture,
      });
    }
  }
};

// Alias mutation if operationName matches
export const aliasMutation = (req, operationName) => {
  if (hasOperationName(req, operationName)) {
    req.alias = getMutationFullName(operationName);
  }
};

export const getQueryFullName = (operationName) => {
  return `gql${operationName}Query`;
};

export const getMutationFullName = (operationName) => {
  return `gql${operationName}Mutation`;
};

export function getNDaysAgo(n) {
  return moment().subtract(n, "days").utc().format("YYYY-MM-DDTHH:mm:ss");
}

export function getNHoursAgo(n) {
  return moment().subtract(n, "hours").utc().format("YYYY-MM-DDTHH:mm:ss");
}

export function getNYearsAgo(n) {
  return moment().subtract(n, "years").utc().format("YYYY-MM-DDTHH:mm:ss");
}

export function getNMonthsAgo(n) {
  return moment().subtract(n, "month").utc().format("YYYY-MM-DDTHH:mm:ss");
}
