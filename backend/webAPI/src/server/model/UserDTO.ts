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
  userId?: number;
  accessToken?: string;
  refreshToken?: string;

  constructor(user_id: number, access_token: string, refresh_token: string) {
    this.userId = user_id;
    this.accessToken = access_token;
    this.refreshToken = refresh_token;
  }
}
