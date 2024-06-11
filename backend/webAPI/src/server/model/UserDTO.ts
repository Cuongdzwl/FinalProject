import { RoleDTO } from "./RoleDTO";
export class UserDTO {
  id?: number;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;

  
}
export class UserInfomationDTO {
  id?: number;
  name?: string;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
  role_id?: RoleDTO;
}
export class UserAccountDTO {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  constructor(username: string, email: string, password: string) {
    this.name = username;
    this.email = email;
    this.password = password;
  }
}
export class UserAccessTokenDTO{
  user_id?: number;
  access_token?: string;
  refresh_token?: string;

  constructor(user_id: number, access_token: string, refresh_token: string){
      this.user_id = user_id;
      this.access_token = access_token;
      this.refresh_token = refresh_token;
  }
}