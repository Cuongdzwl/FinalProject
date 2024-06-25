"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthentication = void 0;
const passport_strategy_1 = __importDefault(require("./passport.strategy"));
const utils_1 = __importDefault(require("./utils"));
const UserDTO_1 = require("../../../model/UserDTO");
const logger_1 = __importDefault(require("../../../common/logger"));
const profile_service_1 = __importDefault(require("../user/profile/profile.service"));
class GoogleAuthentication {
    /**
     * Performs the login process using Google OAuth2 strategy.
     *
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next middleware function.
     * @returns {any} - Returns the result of the passport.authenticate method.
     *
     * @remarks
     * This method uses the 'google' strategy from Passport.js to authenticate the user.
     * It sets the scope to ['profile', 'email'] and disables session management.
     * The result of the passport.authenticate method is returned.
     *
     * @example
     * ```typescript
     * login(req, res, next);
     * ```
     */
    login(req, res, next) {
        return passport_strategy_1.default.authenticate('google', {
            scope: ['profile', 'email'],
            session: false,
        })(req, res, next);
    }
    /**
     * Callback function for handling the Google OAuth2 authentication callback.
     *
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next middleware function.
     * @returns {Promise<any>} - A Promise that resolves with a UserAccessTokenDTO object or rejects with an error object.
     *
     * @remarks
     * This method uses the 'google' strategy from Passport.js to authenticate the user.
     * It sets the session to false and handles the callback from Google OAuth2 server.
     * If an error occurs or the user is not authenticated, it rejects the Promise with an error object.
     * If the user is authenticated, it signs an access token and a refresh token using Utils.signAccessToken and Utils.signRefreshToken methods.
     * It then resolves the Promise with a new UserAccessTokenDTO object containing the user ID, access token, and refresh token.
     *
     * @example
     * ```typescript
     * callback(req, res, next).then((userAccessTokenDTO) => {
     *   // Handle successful authentication
     * }).catch((error) => {
     *   // Handle authentication error
     * });
     * ```
     */
    callback(req, res, next) {
        return new Promise((resolve, reject) => {
            passport_strategy_1.default.authenticate('google', { session: false }, (err, user) => {
                if (err || !user) {
                    logger_1.default.error(err);
                    reject({
                        ...err,
                        metadata: { redirect: '/signup' },
                    });
                    return;
                }
                const token = utils_1.default.signAccessToken(user.id);
                const refreshtoken = utils_1.default.signRefreshToken(user.id);
                resolve(new UserDTO_1.UserAccessTokenDTO(user.id, token, refreshtoken));
            })(req, res, next);
        });
    }
    updateUserProfile(userId, profile) {
        // TODO : Udpate user profile when first time login with google
        profile_service_1.default.getUser(userId).then((user) => {
            logger_1.default.info({ ...user, ...profile });
            logger_1.default.info({ ...profile, ...user });
            //   if (user) {
            //     profileService.update(userId, profile).then((r) => {
            //       if (r) {
            //         L.info('User profile updated successfully');
            //       } else {
            //         L.error('Failed to update user profile');
            //       }
            //     });
            //   } else {
            //     L.error('User not found');
            //   }
        });
    }
}
exports.GoogleAuthentication = GoogleAuthentication;
exports.default = new GoogleAuthentication();
//# sourceMappingURL=google.service.js.map