/**
 * Simplified Auth0 Action: Token Exchange + Custom Prompt
 * Trigger: Post Login
 * Dependencies: axios
 * * Secrets:
 * - CTE_CLIENT_ID: The Client ID for token exchange
 * - CTE_CLIENT_SECRET: The Client Secret for token exchange
 * - MY_ACCOUNT_API_AUDIENCE_CUSTOM_DOMAIN: The audience URI (e.g., https://auth.custom.com/me/)
 * - AUTH0_CUSTOM_DOMAIN: Your Auth0 custom domain (e.g., 'auth.custom.com')
 */

const axios = require("axios");

/**
 * Validates that all required secrets are present and formatted correctly.
 * @param {Object} secrets - The event.secrets object.
 * @throws {Error} If validation fails.
 */
function validateEnvironment(secrets) {
  const required = [
    'CTE_CLIENT_ID',
    'CTE_CLIENT_SECRET',
    'MY_ACCOUNT_API_AUDIENCE_CUSTOM_DOMAIN',
    'AUTH0_CUSTOM_DOMAIN'
  ];

  for (const key of required) {
    if (!secrets[key]) {
      throw new Error(`Missing required secret: ${key}`);
    }
  }

  // Common error: Including 'https://' in the domain field. 
  if (secrets.AUTH0_CUSTOM_DOMAIN.includes('://')) {
    throw new Error("AUTH0_CUSTOM_DOMAIN should not include 'https://' or 'http://'. It should be the bare domain.");
  }

  // Ensure Audience is a valid URL
  try {
    new URL(secrets.MY_ACCOUNT_API_AUDIENCE_CUSTOM_DOMAIN);
  } catch (e) {
    throw new Error("MY_ACCOUNT_API_AUDIENCE_CUSTOM_DOMAIN must be a valid absolute URL.");
  }
}

/**
 * Executes a token exchange to acquire a new token.
 */
async function getUserMyAPToken(event) {
  const url = `https://${event.secrets.AUTH0_CUSTOM_DOMAIN}/oauth/token`;
  const audience = event.secrets.MY_ACCOUNT_API_AUDIENCE_CUSTOM_DOMAIN;
  const userId = event.user.user_id;

  // Updated scopes to include read and delete for management
  const requiredScopes = 'read:me:authentication_methods create:me:authentication_methods delete:me:authentication_methods';

  console.log(`Preparing Token Exchange for User: ${userId}`);
  console.log(`Requesting Scopes: ${requiredScopes}`);

  try {
    const payload = {
      grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
      client_id: event.secrets.CTE_CLIENT_ID,
      client_secret: event.secrets.CTE_CLIENT_SECRET,
      audience: audience,
      scope: requiredScopes,
      subject_token: userId,
      subject_token_type: 'urn:cteforms'
    };
    
    const response = await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000 
    });

    console.log("Token exchange successful.");
    return response.data.access_token;

  } catch (error) {
    console.error("Token exchange request failed.");
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${JSON.stringify(error.response.data)}`);
    } else {
      console.error(`Error Message: ${error.message}`);
    }
    return null;
  }
}

/**
 * Handler for PostLogin flow.
 */
exports.onExecutePostLogin = async (event, api) => {
  if (event.transaction.protocol === "oauth2-token-exchange") {
    return;
  }

  try {
    validateEnvironment(event.secrets);

    const myAccountToken = await getUserMyAPToken(event);

    if (!myAccountToken) {
      return api.access.deny('Could not establish a secure session. Please try again.');
    }

    api.prompt.render('ap_joHLLXmZZhDZksdHZwDxMW', {
      vars: {
        api_token: myAccountToken
      }
    });

  } catch (validationError) {
    console.error(`Configuration Error: ${validationError.message}`);
    return api.access.deny('Authentication configuration error.');
  }
};

/**
 * Handler for continuation.
 */
exports.onContinuePostLogin = async (event, api) => {
  console.log("User successfully continued from custom prompt.");
};