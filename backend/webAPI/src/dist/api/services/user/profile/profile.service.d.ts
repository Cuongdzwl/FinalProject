import { UserInformationDTO } from '../../../../model/UserDTO';
import { IProfileService } from './profile.interface';
import { GeneralService } from '../../general.service';
export declare class ProfileService extends GeneralService implements IProfileService {
    all(): Promise<any>;
    getUser(id: number): Promise<any>;
    getUserRoles(id: number): Promise<any>;
    update(id: number, data: UserInformationDTO): Promise<any>;
    delete(): void;
    generateCacheKey(id: number, custom?: string): string;
}
declare const _default: ProfileService;
export default _default;
