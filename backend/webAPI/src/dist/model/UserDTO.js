"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAccessTokenDTO = exports.UserAccountDTO = exports.UserInfomationDTO = exports.UserDTO = void 0;
class UserDTO {
}
exports.UserDTO = UserDTO;
class UserInfomationDTO {
}
exports.UserInfomationDTO = UserInfomationDTO;
class UserAccountDTO {
    constructor(username, email, password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }
}
exports.UserAccountDTO = UserAccountDTO;
class UserAccessTokenDTO {
    constructor(user_id, access_token, refresh_token) {
        this.user_id = user_id;
        this.access_token = access_token;
        this.refresh_token = refresh_token;
    }
}
exports.UserAccessTokenDTO = UserAccessTokenDTO;
//# sourceMappingURL=UserDTO.js.map