import { RoleDTO } from './RoleDTO';
export class UserDTO {
  id?: number;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export class UserInformationDTO {
  userId?: number | null;
  firstName?: string | null;
  lastName?: string | null;
  dob?: Date | null;
  bio?: string | null;
  avatar?: string | null;
  isMale?: boolean | null;
  phone?: string | null;
  phoneverified?: boolean | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
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
export class UserAccessTokenDTO {
  user_id?: number;
  access_token?: string;
  refresh_token?: string;

  constructor(user_id: number, access_token: string, refresh_token: string) {
    this.user_id = user_id;
    this.access_token = access_token;
    this.refresh_token = refresh_token;
  }
}
