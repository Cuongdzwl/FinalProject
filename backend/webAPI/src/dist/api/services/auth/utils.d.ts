export default class Utils {
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
    static signAccessToken(userId: number): string;
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
    static signRefreshToken(userId: number): string;
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
    static signResetPasswordToken(userId: number): string;
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
    static verifyAccessToken(token: string): any;
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
    static verifyResetPasswordToken(token: string): any;
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
    static verifyRefreshToken(token: string): any;
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
    static generateSalt(rounds?: number): Promise<string>;
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
    static hashPassword(password: string, salt: string): Promise<string>;
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
    static validatePassword(password: string, hashedPassword: string): Promise<boolean>;
}
