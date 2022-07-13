export const errorMessagesEnum = {
  INTERNAL_SERVER_ERROR: {
    message: 'Internal Server Error',
    httpStatusCode: 500,
    code: 3000,
  },
  NOT_IMPLEMENTED: {
    message: 'Not implemented',
    httpStatusCode: 500,
    code: 3001,
  },

  UNAUTHORIZED: {
    message: 'unAuthorized',
    httpStatusCode: 401,
    code: 1000,
  },

  YOU_DONT_HAVE_ACCESS_TO_THIS_SCOPE: {
    message: 'You dont have access to this scope',
    httpStatusCode: 403,
    code: 1001,
  },
  TOKEN_DOESNT_HAVE_ACCESS_TO_THIS_SCOPE: {
    message: 'Access token doesnt have access to this scope',
    httpStatusCode: 403,
    code: 1002,
  },
  SCOPE_NOT_FOUND: {
    message: 'Invalid scope',
    httpStatusCode: 403,
    code: 1003,
  },
  INVALID_FROM_WALLET_ADDRESS: {
    message: 'Invalid fromWalletAddress',
    httpStatusCode: 400,
    code: 2001,
  },
  INVALID_TO_WALLET_ADDRESS: {
    message: 'Invalid toWalletAddress',
    httpStatusCode: 400,
    code: 2002,
  },
  IMPACT_GRAPH_VALIDATION_ERROR: {
    message: 'Invalid input data',
    httpStatusCode: 400,
    code: 2003,
  },
};
