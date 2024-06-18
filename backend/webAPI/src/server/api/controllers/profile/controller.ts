import ProfileService from './../../services/user/profile/profile.service';
import { UserAccountDTO, UserInformationDTO } from './../../../model/UserDTO';
import { Request, Response, NextFunction } from 'express';
import { JsonResponse } from '../../../api/common/utils';
import { UserInformation } from '@prisma/client';
export class UserProfileController {
  getUser(_: Request, res: Response): void {
    ProfileService.getUser(res.locals.user.id as number)
      .then((r) => {
        if (r) {
          res.status(200).json(new JsonResponse().success(r).build());
        } else {
          res.status(404).json(new JsonResponse().error('User not found.').build());
        }
      })
      .catch((err) => {
        res.status(401).json(new JsonResponse().error(err.message).build());
      });
  }
  update(req: Request, res: Response): void {
    var profile: UserInformationDTO = req.body;
    ProfileService.update(res.locals.user.id as number, profile)
      .then((r) => {
        if (r) {
          res.status(200).json(new JsonResponse().success(r).build());
        } else {
          res.status(404).json(new JsonResponse().error('User not found.').build());
        }
      })
      .catch((err) => {
        res.status(401).json(new JsonResponse().error(err.message).build());
      });
  }
}

export default new UserProfileController();
