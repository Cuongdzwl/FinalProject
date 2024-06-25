import { IUserService } from './user.interface';
import { GeneralService } from '../general.service';
export declare class UserService extends GeneralService implements IUserService {
    /**
     * Fetches all users from the database based on the pagination and order options.
     * If there is an error during the database operation, it will fall back to fetching without pagination options.
     *
     * @returns A Promise that resolves to an array of User objects.
     *
     * @throws Will throw an error if there is a problem with the database connection.
     */
    all(): Promise<any>;
    /**
     * Counts the number of users based on the provided filter and value.
     * If the result is cached, it will be fetched from the cache instead of the database.
     *
     * @param filter - The field to filter on.
     * @param value - The value to match in the filter field.
     * @returns A Promise that resolves to the count of users.
     *
     * @throws Will throw an error if there is a problem with the database connection or cache retrieval.
     */
    count(filter?: string, value?: string): Promise<any>;
    update(id: number, data: any): Promise<any>;
    byId(id: number): Promise<any>;
    findBy(field: string, value: string): Promise<any>;
    create(data: any): Promise<any>;
    delete(id: number): Promise<any>;
    generateCacheKey(id?: number, custom?: string): string;
}
declare const _default: UserService;
export default _default;
