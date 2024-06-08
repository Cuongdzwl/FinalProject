import  UserDTO  from '../../../model/UserDTO';

export interface IAuthenticationService {
    login(username: string, password: string): void;
    logout(): void;
    isAuthenticated(): boolean
    getUser(): UserDTO
}