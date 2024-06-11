export interface OAuth2Strategy {
    login(): Promise<any>;
    callback(): Promise<any>;
}