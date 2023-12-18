import type { MSALConfiguration, MSALInteractiveParams, MSALSilentParams, MSALAccount, MSALSignoutParams, MSALResult, IPublicClientApplication } from './types';
export declare class PublicClientApplication implements IPublicClientApplication {
    private readonly config;
    private _pca;
    constructor(config: MSALConfiguration);
    init(): Promise<this>;
    acquireToken(params: MSALInteractiveParams): Promise<MSALResult | undefined>;
    acquireTokenSilent(params: MSALSilentParams): Promise<MSALResult | undefined>;
    getAccounts(): Promise<MSALAccount[]>;
    getAccount(accountIdentifier: string): Promise<MSALAccount | undefined>;
    removeAccount(account: MSALAccount): Promise<boolean>;
    signOut(params: MSALSignoutParams): Promise<boolean>;
}
