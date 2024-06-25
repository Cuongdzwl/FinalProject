/// <reference types="cookie-parser" />
import { Request, Response } from 'express';
export declare class UserProfileController {
    create(): void;
    delete(): void;
    /**
     * Retrieves the user profile from the cache or database.
     *
     * @param {Request} _ - The request object.
     * @param {Response} res - The response object.
     *
     * @returns {void}
     */
    getUser(_: Request, res: Response): void;
    updateOrInsert(req: Request, res: Response): void;
}
declare const _default: UserProfileController;
export default _default;
