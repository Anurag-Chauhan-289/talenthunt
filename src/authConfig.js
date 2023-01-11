/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { LogLevel } from "@azure/msal-browser";

/**
 * Enter here the user flows and custom policies for your B2C application
 * To learn more about user flows, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview
 * To learn more about custom policies, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview
 */
export const b2cPolicies = {
    names: {
        signUpSignIn: 'B2C_1_TalentHunt',
        forgotPassword: 'B2C_1_reset_v3',
        editProfile: 'B2C_1_edit_profile_v2',
    },
    authorities: {
        signUpSignIn: {
            authority: 'https://talenthuntb2c.b2clogin.com/talenthuntb2c.onmicrosoft.com/B2C_1_TalentHunt',
        },
        forgotPassword: {
            authority: 'https://talenthuntb2c.b2clogin.com/talenthuntb2c.onmicrosoft.com/B2C_1_TalentHunt',
        },
        editProfile: {
            authority: 'https://talenthuntb2c.b2clogin.com/talenthuntb2c.onmicrosoft.com/b2c_1_edit_profile_v2',
        },
    },
    authorityDomain: 'talenthuntb2c.b2clogin.com',
};


/**
 * Configuration object to be passed to MSAL instance on creation. 
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 
 */
export const msalConfig = {
    auth: {
        clientId: 'ef9f72fb-0d2c-4dc4-a78c-0cf8dc27f318', // This is the ONLY mandatory field that you need to supply.
        authority: b2cPolicies.authorities.signUpSignIn.authority, // Choose SUSI as your default authority.
        knownAuthorities: [b2cPolicies.authorityDomain], // Mark your B2C tenant's domain as trusted.
        redirectUri: 'http://localhost:3000/', // You must register this URI on Azure Portal/App Registration. Defaults to window.location.origin
        postLogoutRedirectUri: 'http://localhost:3000/', // Indicates the page to navigate after logout.
        navigateToLoginRequestUrl: false, // If "true", will navigate back to the original request location before processing the auth code response.
    },
    // http://localhost:44347/
    cache: {
        cacheLocation: 'sessionStorage', // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
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
            },
        },
    },
};

/**
 * Add here the endpoints and scopes when obtaining an access token for protected web APIs. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const protectedResources = {
    apiTodoList: {
        endpoint: 'http://localhost:3000/',
        scopes: {
            // read: ['https://graph.microsoft.com/openid'],
            read: ['https://talenthuntb2c.onmicrosoft.com/ef9f72fb-0d2c-4dc4-a78c-0cf8dc27f318/tasks.read'],
            // write: ['https://talenthuntb2c.onmicrosoft.com/TodoList/ToDoList.ReadWrite'],
            write: ['https://talenthuntb2c.onmicrosoft.com/ef9f72fb-0d2c-4dc4-a78c-0cf8dc27f318/tasks.ReadWrite']
        },
    },
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit: 
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
    // scopes: [...protectedResources.apiTodoList.scopes.read],
    scopes: [...protectedResources.apiTodoList.scopes.read, ...protectedResources.apiTodoList.scopes.write],
    // scope: 'openid profile',
};
