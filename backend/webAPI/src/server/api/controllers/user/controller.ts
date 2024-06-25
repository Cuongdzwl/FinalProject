import { UserAccountDTO } from './../../../model/UserDTO';
import { Request, Response } from 'express';
import { JsonResponse } from '../../../api/common/utils';
import cacheService from '../../../api/services/cache/cache.service';
import userService from './../../services/user/user.service';
import profileService from 'server/api/services/user/profile/profile.service';

/**
 * Controller for handling user-related operations.
 * TODO: validate user input
 */
export class UserController {
  getUser(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (id)
      cacheService
        .getCacheOrDb(userService.generateCacheKey(id), () =>
          userService.byId(id)
        )
        .then((r) => {
          if (r) {
            res.status(200).json(new JsonResponse().success(r).build());
          } else {
            res
              .status(404)
              .json(new JsonResponse().error('User not found').build());
          }
        })
        .catch(() =>
          res
            .status(404)
            .json(new JsonResponse().error('User not found').build())
        );
    else res.status(400).json(new JsonResponse().error('Invalid ID').build());
  }
  createUser(req: Request, res: Response) {
    const data: UserAccountDTO = req.body;
    userService
      .create(data)
      .then((_) => {
        res
          .status(201)
          .json(
            new JsonResponse().success('Created user successfully').build()
          );
        cacheService.invalidateCache(userService.generateCacheKey());
      })
      .catch((error) => {
        res.status(400).json(new JsonResponse().error(error.message).build());
      });
  }
  deleteUser(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (id)
      userService
        .delete(id)
        .then((_) => {
          res
            .status(200)
            .json(
              new JsonResponse().success('Deleted user successfully').build()
            );
          cacheService.invalidateCache(userService.generateCacheKey());
          cacheService.invalidateCache(userService.generateCacheKey(id));
        })
        .catch(() =>
          res
            .status(404)
            .json(new JsonResponse().error('User not found').build())
        );
    else res.status(400).json(new JsonResponse().error('Invalid ID').build());
  }
  /**
   * Clears the cache for user data.
   * @param _ - The request object.
   * @param res - The response object.
   */
  cls(_: Request, res: Response): void {
    cacheService.invalidateCache('users');
    res.status(200).json(new JsonResponse().success('ok').build());
  }

  /**
   * Retrieves a paginated list of users.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A Promise that resolves to void.
   */
  async getUsers(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page) || undefined;
    const pageSize = Number(req.query.pageSize) || undefined;
    const filter = req.query.filter || undefined;
    const value = req.query.value || undefined;

    // Fetch users from cache or database
    const cache = await cacheService.getCacheOrDb(
      userService.generateCacheKey(
        undefined,
        `page:${page}${pageSize}${filter}${value}`
      ),
      () => userService.paginate(page, pageSize).order('id', false).all()
    );

    if (cache) {
      res.status(200).json(
        new JsonResponse()
          .success(cache)
          .paginate(
            page,
            pageSize,
            await cacheService.getCacheOrDb(
              userService.generateCacheKey(
                undefined,
                `count:${filter}${value}`
              ),
              () => userService.count()
            )
          )
          .build()
      );
      return;
    } else {
      res.status(404).json(new JsonResponse().error(cache).build());
      return;
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const data: UserAccountDTO = new UserAccountDTO(req.body);
    console.log(data);
    // Update user data
    userService
      .update(id, data)
      .then((r) => {
        if (r) {
          // TODO: handle cache invalidation
          res.status(200).json(new JsonResponse().success(r).build());
          cacheService.invalidateCache(userService.generateCacheKey());
          cacheService.invalidateCache(userService.generateCacheKey(id));
          return;
        } else {
          res.status(404).json(new JsonResponse().error(r).build());
          return;
        }
      })
      .catch((err) => {
        //TODO: Handle Email exists error;
        //TODO: Handle id not found;
        console.error(err);
        res.status(400).json(new JsonResponse().error(err).build());
      });
  }
}

export default new UserController();
