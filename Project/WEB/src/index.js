import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { msalConfig } from './auth/authConfig';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication, EventType } from '@azure/msal-browser';

//MSAL should be instantiated outside the component tree to prevent it from being re-instantiated on page re-renders or reloads
const msalInstance = new PublicClientApplication(msalConfig);


// Default to using the first account, if no account is active add a button to set an active account
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
  //account selection logic is app dependent.
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}


//Listen for sign-in event and set active account
msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
    msalInstance.setActiveAccount(event.payload.account);
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App instance={msalInstance}/>
);