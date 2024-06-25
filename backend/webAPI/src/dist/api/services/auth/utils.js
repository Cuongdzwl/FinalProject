"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SALT_ROUND = 10;
class Utils {
    /**
     * Generates a JWT access token for a user.
     *
     * @param userId - The unique identifier of the user.
     * @returns A JWT access token string.
     *
     * @remarks
     * The access token is signed with a secret key stored in the environment variable `JWT_SECRET`.
     * It expires after 5 minutes.
     *
     * @example
     * ```typescript
     * const accessToken = Utils.signAccessToken(123);
     * console.log(accessToken); // Output: <JWT access token string>
     * ```
     */
    static signAccessToken(userId) {
        return jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_SECRET, {
            expiresIn: '5m',
        });
    }
    /**
     * Generates a JWT refresh token for a user.
     *
     * @param userId - The unique identifier of the user.
     * @returns A JWT refresh token string.
     *
     * @remarks
     * The refresh token is signed with a secret key stored in the environment variable `JWT_REFRESH_SECRET`.
     * It expires after 7 days.
     *
     * @example
     * ```typescript
     * const refreshToken = Utils.signRefreshToken(123);
     * console.log(refreshToken); // Output: <JWT refresh token string>
     * ```
     */
    static signRefreshToken(userId) {
        return jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '7d',
        });
    }
    /**
     * Generates a JWT reset password token for a user.
     *
     * @param userId - The unique identifier of the user.
     * @returns A JWT reset password token string.
     *
     * @remarks
     * The reset password token is signed with a secret key stored in the environment variable `JWT_RESET_SECRET`.
     * It expires after 5 minutes.
     * The token contains an additional `action` property with the value "Reset Password".
     *
     * @example
     * ```typescript
     * const resetPasswordToken = Utils.signResetPasswordToken(123);
     * console.log(resetPasswordToken); // Output: <JWT reset password token string>
     * ```
     */
    static signResetPasswordToken(userId) {
        return jsonwebtoken_1.default.sign({ id: userId, action: 'Reset Password' }, process.env.JWT_RESET_SECRET, {
            expiresIn: '5m',
        });
    }
    /**
     * Verifies a JWT access token and returns its payload.
     *
     * @param token - The JWT access token to verify.
     * @returns The payload of the JWT access token if it is valid, otherwise `undefined`.
     *
     * @remarks
     * This function uses the `jwt.verify` method from the `jsonwebtoken` package to verify the token.
     * The secret key used for verification is stored in the environment variable `JWT_SECRET`.
     *
     * @example
     * ```typescript
     * const accessToken = Utils.signAccessToken(123);
     * const payload = Utils.verifyAccessToken(accessToken);
     * console.log(payload); // Output: { id: 123, iat: <issued at timestamp>, exp: <expiration timestamp> }
     * ```
     *
     * @throws Will throw an error if the token is invalid or expired.
     */
    static verifyAccessToken(token) {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    }
    /**
     * Verifies a JWT reset password token and returns its payload.
     *
     * @param token - The JWT reset password token to verify.
     * @returns The payload of the JWT reset password token if it is valid and the action is "Reset Password", otherwise `null`.
     *
     * @remarks
     * This function uses the `jwt.verify` method from the `jsonwebtoken` package to verify the token.
     * The secret key used for verification is stored in the environment variable `JWT_REFRESH_SECRET`.
     *
     * @example
     * ```typescript
     * const resetPasswordToken = Utils.signResetPasswordToken(123);
     * const payload = Utils.verifyResetPasswordToken(resetPasswordToken);
     * console.log(payload); // Output: { id: 123, action: "Reset Password", iat: <issued at timestamp>, exp: <expiration timestamp> }
     * ```
     *
     * @throws Will throw an error if the token is invalid or expired.
     */
    static verifyResetPasswordToken(token) {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
        if (!decoded) {
            return null;
        }
        if (decoded.action !== 'Reset Password') {
            return null;
        }
        return decoded;
    }
    /**
     * Verifies a JWT refresh token and returns its payload.
     *
     * @param token - The JWT refresh token to verify.
     * @returns The payload of the JWT refresh token if it is valid, otherwise `undefined`.
     *
     * @remarks
     * This function uses the `jwt.verify` method from the `jsonwebtoken` package to verify the token.
     * The secret key used for verification is stored in the environment variable `JWT_REFRESH_SECRET`.
     *
     * @example
     * ```typescript
     * const refreshToken = Utils.signRefreshToken(123);
     * const payload = Utils.verifyRefreshToken(refreshToken);
     * console.log(payload); // Output: { id: 123, iat: <issued at timestamp>, exp: <expiration timestamp> }
     * ```
     *
     * @throws Will throw an error if the token is invalid or expired.
     */
    static verifyRefreshToken(token) {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
    }
    /**
   * Generates a salt for password hashing using bcrypt.
   *
   * @param rounds - The number of rounds to use for salt generation. Default is 10.
   * @returns A promise that resolves to the generated salt.
   *
   * @remarks
   * This function uses the `bcrypt.genSalt` method to generate a salt.
   * The salt is used in conjunction with a password to create a hashed password.
   * The number of rounds specifies the computational cost of the salt generation.
   * A higher number of rounds increases the security but also takes longer to generate.
   *
   * @example
   * ```typescript
   * const salt = await Utils.generateSalt(12);
   * console.log(salt); // Output: <generated salt>
   * ```
   *
   * @throws Will throw an error if the salt generation fails.
   */
    static async generateSalt(rounds = 10) {
        return bcrypt_1.default.genSalt(rounds);
    }
    /**
     * Hashes a password using bcrypt with a given salt.
     *
     * @param password - The password to hash.
     * @param salt - The salt to use for hashing.
     * @returns A promise that resolves to the hashed password.
     *
     * @remarks
     * This function uses the `bcrypt.hash` method to hash the password.
     * The salt is generated using the `generateSalt` method.
     * The hashed password can be stored securely in a database.
     *
     * @example
     * ```typescript
     * const salt = await Utils.generateSalt(12);
     * const hashedPassword = await Utils.hashPassword('mySecurePassword', salt);
     * console.log(hashedPassword); // Output: <hashed password>
     * ```
     *
     * @throws Will throw an error if the password hashing fails.
     */
    static async hashPassword(password, salt) {
        return bcrypt_1.default.hash(password, salt);
    }
    /**
   * Validates a password against a hashed password using bcrypt.
   *
   * @param password - The password to validate.
   * @param hashedPassword - The hashed password to compare against.
   * @returns A promise that resolves to `true` if the password matches the hashed password, otherwise `false`.
   *
   * @remarks
   * This function uses the `bcrypt.compare` method to compare the password with the hashed password.
   * It is important to note that this function does not throw an error if the comparison fails.
   * Instead, it returns `false` to indicate that the password does not match.
   *
   * @example
   * ```typescript
   * const hashedPassword = await Utils.hashPassword('mySecurePassword', salt);
   * const isValid = await Utils.validatePassword('mySecurePassword', hashedPassword);
   * console.log(isValid); // Output: true
   * ```
   *
   * @throws Will throw an error if the bcrypt library encounters an internal error during the comparison.
   */
    static async validatePassword(password, hashedPassword) {
        return await bcrypt_1.default.compare(password, hashedPassword);
    }
}
exports.default = Utils;
//# sourceMappingURL=utils.js.map