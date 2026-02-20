/**
* Handler to be executed while executing a custom token exchange request
* @param {Event} event - Details about the incoming token exchange request.
* @param {CustomTokenExchangeAPI} api - Methods and utilities to define token exchange process.
*/

// https://auth0.com/docs/authenticate/custom-token-exchange


exports.onExecuteCustomTokenExchange = async (event, api) => {  
  api.authentication.setUserById(event.transaction.subject_token);

  return;
};