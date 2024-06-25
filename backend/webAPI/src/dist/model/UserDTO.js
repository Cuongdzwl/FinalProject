"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAccessTokenDTO = exports.UserAccountInfomationDTO = exports.UserAccountDTO = exports.UserInformationDTO = exports.UserDTO = void 0;
class UserDTO {
}
exports.UserDTO = UserDTO;
class UserInformationDTO {
    constructor(data) {
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
exports.UserInformationDTO = UserInformationDTO;
class UserAccountDTO {
    constructor(data) {
        this.name = data.username;
        this.email = data.email;
        this.password = data.password;
    }
}
exports.UserAccountDTO = UserAccountDTO;
class UserAccountInfomationDTO {
    constructor(data) {
        this.name = data.username;
        this.email = data.email;
        this.password = data.password;
    }
}
exports.UserAccountInfomationDTO = UserAccountInfomationDTO;
class UserAccessTokenDTO {
    constructor(user_id, access_token, refresh_token) {
        this.userId = user_id;
        this.accessToken = access_token;
        this.refreshToken = refresh_token;
    }
}
exports.UserAccessTokenDTO = UserAccessTokenDTO;
//# sourceMappingURL=UserDTO.js.map