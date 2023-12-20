const { Platform } = require('react-native');
const PublicClientApplication = require('react-native-msal');

class B2CClient {
  static B2C_PASSWORD_CHANGE = 'AADB2C90118';
  static B2C_EXPIRED_GRANT = 'AADB2C90080';

  constructor(b2cConfig) {
    const { authorityBase, policies, ...restOfAuthConfig } = b2cConfig.auth;
    this.policyUrls = makePolicyUrls(authorityBase, policies);

    const authority = this.policyUrls.signInSignUp;
    const knownAuthorities = Object.values(this.policyUrls);

    this.pca = new PublicClientApplication({
      ...b2cConfig,
      auth: { authority, knownAuthorities, ...restOfAuthConfig,
        redirectUri: Platform.select({
            android: 'msauth://com.anonymous.FitHub/lvGC0B4SWYU8tNPHg%2FbdMjQinZQ%3D', // ex: "msauth://com.package/Xo8WBi6jzSxKDVR4drqm84yr9iU%3D"
            default: undefined,
          }),},
    });
  }

  async init() {
    await this.pca.init();
    return this;
  }

  async signIn(params) {
    const isSignedIn = await this.isSignedIn();
    if (isSignedIn) {
      throw Error('A user is already signed in');
    }

    try {
      const result = await this.pca.acquireToken(params);
      if (!result) {
        throw new Error('Could not sign in: Result was undefined.');
      }
      return result;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes(B2CClient.B2C_PASSWORD_CHANGE) &&
        this.policyUrls.passwordReset
      ) {
        return await this.resetPassword(params);
      } else {
        throw error;
      }
    }
  }

  async acquireTokenSilent(params) {
    const account = await this.getAccountForPolicy(this.policyUrls.signInSignUp);
    if (account) {
      try {
        const result = await this.pca.acquireTokenSilent({ ...params, account });
        if (!result) {
          throw new Error('Could not acquire token silently: Result was undefined.');
        }
        return result;
      } catch (error) {
        if (error instanceof Error && error.message.includes(B2CClient.B2C_EXPIRED_GRANT)) {
          await this.pca.signOut({ ...params, account });
          return await this.signIn(params);
        } else {
          throw error;
        }
      }
    } else {
      throw Error('Could not find an existing account for sign-in/sign-up policy');
    }
  }

  async isSignedIn() {
    const signInAccount = await this.getAccountForPolicy(this.policyUrls.signInSignUp);
    return signInAccount !== undefined;
  }

  async signOut(params) {
    const accounts = await this.pca.getAccounts();
    const signOutPromises = accounts.map((account) => this.pca.signOut({ ...params, account }));
    await Promise.all(signOutPromises);
    return true;
  }

  async resetPassword(params) {
    const { webviewParameters: wvp, ...rest } = params;
    const webviewParameters = {
      ...wvp,
      ios_prefersEphemeralWebBrowserSession: true,
    };
    if (this.policyUrls.passwordReset) {
      if (Platform.OS === 'ios') {
        await delay(1000);
      }
      const authority = this.policyUrls.passwordReset;
      await this.pca.acquireToken({ ...rest, webviewParameters, authority });
      return await this.signIn(params);
    } else {
      throw Error('B2CClient is missing the password reset policy');
    }
  }

  async getAccountForPolicy(policyUrl) {
    const policy = policyUrl.split('/').pop();
    const accounts = await this.pca.getAccounts();
    return accounts.find((account) => account.identifier.includes(policy.toLowerCase()));
  }
}

function makeAuthority(authorityBase, policyName) {
  return `${authorityBase}/${policyName}`;
}

function makePolicyUrls(authorityBase, policyNames) {
  return Object.entries(policyNames).reduce(
    (prev, [key, policyName]) => ({ ...prev, [key]: makeAuthority(authorityBase, policyName) }),
    {}
  );
}

async function delay(ms) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}
