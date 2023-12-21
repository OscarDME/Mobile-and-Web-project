/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { LogLevel } from "@azure/msal-browser";


const b2cPolicies = {
    names: {
        signUpSignIn: "B2C_1_FitHub_Login",
        editProfile: "B2C_1_Edit_Profile"
    },
    authorities: {
        signUpSignIn: {
            authority: "https://FitHubMX.onmicrosoft.com/FitHubMX.onmicrosoft.com/B2C_1_FitHub_Login",
        },
        editProfile: {
            authority: "https://FitHubMX.onmicrosoft.com/FitHubMX.onmicrosoft.com/B2C_1_Edit_Profile"
        }
    },
    authorityDomain: "FitHubMX.onmicrosoft.com"
}

export const msalConfig = {
    auth: {
      clientId:  "601e3e43-ea15-425c-a787-96626267d747",
      authority: b2cPolicies.authorities.signUpSignIn.authority,
      knownAuthorities: [b2cPolicies.authorityDomain],
      PolicyId: b2cPolicies.names.signUpSignIn,
      redirectUri: "/",
      postLogoutRedirectUri: "/",
      navigateToLoginRequestUrl: false, // Determines whether navigate to the original request URL after the auth flow is completed.
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {	
        loggerOptions: {	
            loggerCallback: (level, message, containsPii) => {	
                if (containsPii) {		
                    return;		
                }		
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }	
            }	
        }	
    }
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit: 
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */

export const loginRequest = {
    scopes: ["User.Read", "profile", "offline_access","openid", ...apiConfig.b2cScopes]
};

/**
 * Add here the scopes to request when obtaining an access token for MS Graph API. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const graphConfig = {
    graphMeEndpoint: "Enter_the_Graph_Endpoint_Herev1.0/me" //e.g. https://graph.microsoft.com/v1.0/me
};

/**
 * Scopes you add here will be used to request a token from Azure AD B2C to be used for accessing a protected resource.
 * To learn more about how to work with scopes and resources, see: 
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
const tokenRequest = {
  scopes: [...apiConfig.b2cScopes],  // e.g. ["https://fabrikamb2c.onmicrosoft.com/helloapi/demo.read"]
  forceRefresh: false // Set this to "true" to skip a cached token and go to the server to get a new token
};