import { IAccountService } from './account.interface';
export declare class AccountService implements IAccountService {
    all(): Promise<any>;
    create(): Promise<any>;
    byId(id: number): Promise<any>;
    findBy(_: string): Promise<any>;
    update(): Promise<any>;
    delete(): Promise<any>;
}
