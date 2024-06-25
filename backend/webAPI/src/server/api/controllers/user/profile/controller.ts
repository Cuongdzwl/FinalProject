import ProfileService from '../../../services/user/profile/profile.service';
import { UserAccountDTO, UserInformationDTO } from '../../../../model/UserDTO';
import { Request, Response, NextFunction } from 'express';
import { JsonResponse } from '../../../common/utils';
import { UserInformation } from '@prisma/client';
import cacheService from '../../../services/cache/cache.service';
export class UserProfileController {

  create() {
    throw new Error('Method not implemented.');
  }
  delete() {
    throw new Error('Method not implemented.');
  }
  
  /**
   * Retrieves the user profile from the cache or database.
   *
   * @param {Request} _ - The request object.
   * @param {Response} res - The response object.
   *
   * @returns {void}
   */
  getUser(_: Request, res: Response): void {
    cacheService
      .getCacheOrDb(
        ProfileService.generateCacheKey(res.locals.user.id as number),
        () => ProfileService.getUser(res.locals.user.id as number)
      )
      .then((r) => {
        if (r) {
          res.status(200).json(new JsonResponse().success(r).build());
        } else {
          res
            .status(404)
            .json(new JsonResponse().error('Profile not found').build());
        }
      })
      .catch((err) => {
        res.status(401).json(new JsonResponse().error(err.message).build());
      });
  }
  updateOrInsert(req: Request, res: Response): void {
    var profile: UserInformationDTO = new UserInformationDTO(req.body);
    profile.userId = res.locals.user.id as number;
    ProfileService.update(res.locals.user.id as number, profile)
      .then((r) => {
        if (r) {
          res.status(200).json(new JsonResponse().success(r).build());
        } else {
          res
            .status(404)
            .json(new JsonResponse().error('User not found.').build());
        }
        cacheService.invalidateCache(ProfileService.generateCacheKey(res.locals.user.id as number)); 
      })
      .catch((err) => {
        res.status(401).json(new JsonResponse().error(err.message).build());
      });
  }

  reqVerification(_req: Request, _res: Response) {
    throw new Error('Method not implemented.');
  }
  checkVerification(_req: Request, _res: Response) {
    throw new Error('Method not implemented.');
  }
  getAllVerifications(_req: Request, _res: Response) {
    throw new Error('Method not implemented.');
  }
  createVerification(_req: Request, _res: Response) {
    throw new Error('Method not implemented.');
  }
  getVerification(_req: Request, _res: Response) {
    throw new Error('Method not implemented.');
  }
  proceedVerification(_req: Request, _res: Response) {
    throw new Error('Method not implemented.');
  }
}

export default new UserProfileController();
