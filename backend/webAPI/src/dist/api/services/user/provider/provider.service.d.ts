import { AuthenticationProvider } from '@prisma/client';
export declare class ProviderService {
    update(__: string, _: any): Promise<any>;
    byId(id: number): Promise<any>;
    findBy(field: string, value: string): Promise<any>;
    getUserProviders(userid: number, provider?: string): Promise<any>;
    createAuthenticationProvider(name: string): Promise<AuthenticationProvider>;
    getAuthenticationProviderId(name: string): Promise<number>;
    create(userid: number, provider: string, key: string): Promise<any>;
    delete(_: string): Promise<any>;
}
declare const _default: ProviderService;
export default _default;
