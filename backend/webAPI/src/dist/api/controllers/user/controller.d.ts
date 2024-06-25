/// <reference types="cookie-parser" />
import { Request, Response } from 'express';
/**
 * Controller for handling user-related operations.
 * TODO: validate user input
 */
export declare class UserController {
    getUser(req: Request, res: Response): void;
    createUser(req: Request, res: Response): void;
    deleteUser(req: Request, res: Response): void;
    /**
     * Clears the cache for user data.
     * @param _ - The request object.
     * @param res - The response object.
     */
    cls(_: Request, res: Response): void;
    /**
     * Retrieves a paginated list of users.
     * @param req - The request object.
     * @param res - The response object.
     * @returns A Promise that resolves to void.
     */
    getUsers(req: Request, res: Response): Promise<void>;
    updateUser(req: Request, res: Response): Promise<void>;
}
declare const _default: UserController;
export default _default;
