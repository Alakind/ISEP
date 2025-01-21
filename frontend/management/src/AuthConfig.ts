import {Configuration, LogLevel} from "@azure/msal-browser"

export const msalConfig: Configuration = {
  auth: {
    clientId: 'ed631f5b-f79b-462d-bc24-e74070b359f6',
    authority: 'https://login.microsoftonline.com/687c0e2f-17b0-4663-90df-261e3fd76ef6',
    redirectUri: `${import.meta.env.VITE_DOMAIN}/dashboard`,
    postLogoutRedirectUri: `${import.meta.env.VITE_DOMAIN}/applicants`,
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
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
}

export const loginRequest = {
  scopes: ['User.Read']
}

export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me" //e.g. https://graph.microsoft.com/v1.0/me
};