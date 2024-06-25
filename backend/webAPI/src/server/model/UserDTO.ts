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
  constructor(data: any) {
    this.userId = data.userId;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.dob = data.dob;
    this.bio = data.bio;
    this.avatar = data.avatar;
    this.isMale = data.isMale;
    this.phone = data.phone;
    this.phoneverified = data.phoneverified;
    this.address = data.address;
    this.city = data.city;
    this.country = data.country;
  }
}
export class UserAccountDTO {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  constructor(data: any) {
    this.name = data.username;
    this.email = data.email;
    this.password = data.password;
  }
}
export class UserAccountInfomationDTO {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  constructor(data: any) {
    this.name = data.username;
    this.email = data.email;
    this.password = data.password;
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
