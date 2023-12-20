const PublicClientApplication = require('react-native-msal');
const { MSALConfiguration } = require('react-native-msal');

const config = {
  auth: {
    clientId: '397efb78-e816-419e-aa9f-71b4a475de92',
    authority: 'https://login.microsoftonline.com/FitHubMX.onmicrosoft.com',
    user_flow_policy: "B2C_1_FitHub_Login",
  },
};


const scopes = ['user.read'];

// Initialize the public client application:
const pca = new PublicClientApplication(config);
try {
  await pca.init();
} catch (error) {
  console.error('Error initializing the pca, check your config.', error);
}

// Acquiring a token for the first time, you must call pca.acquireToken
const params = { scopes };
const result = await pca.acquireToken(params);

// On subsequent token acquisitions, you can call `pca.acquireTokenSilent`
// Force the token to refresh with the `forceRefresh` option
const silentParams = {
  account: result.account,
  scopes,
  forceRefresh: true,
};
const silentResult = await pca.acquireTokenSilent(silentParams);

// Get all accounts for which this application has refresh tokens
const accounts = await pca.getAccounts();

// Retrieve the account matching the identifier
const account = await pca.getAccount(result.account.identifier);

// Remove all tokens from the cache for this application for the provided account
const success = await pca.removeAccount(result.account);

// Same as `pca.removeAccount` with the exception that, if called on iOS with the `signoutFromBrowser` option set to true, it will additionally remove the account from the system browser
const signoutParams = {
  account: result.account,
  signoutFromBrowser: true,
};

const signoutSuccess = await pca.signOut(signoutParams);
