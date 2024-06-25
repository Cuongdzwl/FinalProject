"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserDTO_1 = require("./../../../model/UserDTO");
const utils_1 = require("../../../api/common/utils");
const cache_service_1 = __importDefault(require("../../../api/services/cache/cache.service"));
const user_service_1 = __importDefault(require("./../../services/user/user.service"));
/**
 * Controller for handling user-related operations.
 * TODO: validate user input
 */
class UserController {
    getUser(req, res) {
        const id = Number(req.params.id);
        if (id)
            cache_service_1.default
                .getCacheOrDb(user_service_1.default.generateCacheKey(id), () => user_service_1.default.byId(id))
                .then((r) => {
                if (r) {
                    res.status(200).json(new utils_1.JsonResponse().success(r).build());
                }
                else {
                    res
                        .status(404)
                        .json(new utils_1.JsonResponse().error('User not found').build());
                }
            })
                .catch(() => res
                .status(404)
                .json(new utils_1.JsonResponse().error('User not found').build()));
        else
            res.status(400).json(new utils_1.JsonResponse().error('Invalid ID').build());
    }
    createUser(req, res) {
        const data = req.body;
        user_service_1.default
            .create(data)
            .then((_) => {
            res
                .status(201)
                .json(new utils_1.JsonResponse().success('Created user successfully').build());
            cache_service_1.default.invalidateCache(user_service_1.default.generateCacheKey());
        })
            .catch((error) => {
            res.status(400).json(new utils_1.JsonResponse().error(error.message).build());
        });
    }
    deleteUser(req, res) {
        const id = Number(req.params.id);
        if (id)
            user_service_1.default
                .delete(id)
                .then((_) => {
                res
                    .status(200)
                    .json(new utils_1.JsonResponse().success('Deleted user successfully').build());
                cache_service_1.default.invalidateCache(user_service_1.default.generateCacheKey());
                cache_service_1.default.invalidateCache(user_service_1.default.generateCacheKey(id));
            })
                .catch(() => res
                .status(404)
                .json(new utils_1.JsonResponse().error('User not found').build()));
        else
            res.status(400).json(new utils_1.JsonResponse().error('Invalid ID').build());
    }
    /**
     * Clears the cache for user data.
     * @param _ - The request object.
     * @param res - The response object.
     */
    cls(_, res) {
        cache_service_1.default.invalidateCache('users');
        res.status(200).json(new utils_1.JsonResponse().success('ok').build());
    }
    /**
     * Retrieves a paginated list of users.
     * @param req - The request object.
     * @param res - The response object.
     * @returns A Promise that resolves to void.
     */
    async getUsers(req, res) {
        const page = Number(req.query.page) || undefined;
        const pageSize = Number(req.query.pageSize) || undefined;
        const filter = req.query.filter || undefined;
        const value = req.query.value || undefined;
        // Fetch users from cache or database
        const cache = await cache_service_1.default.getCacheOrDb(user_service_1.default.generateCacheKey(undefined, `page:${page}${pageSize}${filter}${value}`), () => user_service_1.default.paginate(page, pageSize).order('id', false).all());
        if (cache) {
            res.status(200).json(new utils_1.JsonResponse()
                .success(cache)
                .paginate(page, pageSize, await cache_service_1.default.getCacheOrDb(user_service_1.default.generateCacheKey(undefined, `count:${filter}${value}`), () => user_service_1.default.count()))
                .build());
            return;
        }
        else {
            res.status(404).json(new utils_1.JsonResponse().error(cache).build());
            return;
        }
    }
    async updateUser(req, res) {
        const id = Number(req.params.id);
        const data = new UserDTO_1.UserAccountDTO(req.body);
        console.log(data);
        // Update user data
        user_service_1.default
            .update(id, data)
            .then((r) => {
            if (r) {
                // TODO: handle cache invalidation
                res.status(200).json(new utils_1.JsonResponse().success(r).build());
                cache_service_1.default.invalidateCache(user_service_1.default.generateCacheKey());
                cache_service_1.default.invalidateCache(user_service_1.default.generateCacheKey(id));
                return;
            }
            else {
                res.status(404).json(new utils_1.JsonResponse().error(r).build());
                return;
            }
        })
            .catch((err) => {
            //TODO: Handle Email exists error;
            //TODO: Handle id not found;
            console.error(err);
            res.status(400).json(new utils_1.JsonResponse().error(err).build());
        });
    }
}
exports.UserController = UserController;
exports.default = new UserController();
//# sourceMappingURL=controller.js.map