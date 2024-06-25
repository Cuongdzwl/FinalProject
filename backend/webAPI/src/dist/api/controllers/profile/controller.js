"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileController = void 0;
const profile_service_1 = __importDefault(require("./../../services/user/profile/profile.service"));
const UserDTO_1 = require("./../../../model/UserDTO");
const utils_1 = require("../../../api/common/utils");
const cache_service_1 = __importDefault(require("./../../../api/services/cache/cache.service"));
class UserProfileController {
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
    getUser(_, res) {
        cache_service_1.default
            .getCacheOrDb(profile_service_1.default.generateCacheKey(res.locals.user.id), () => profile_service_1.default.getUser(res.locals.user.id))
            .then((r) => {
            if (r) {
                res.status(200).json(new utils_1.JsonResponse().success(r).build());
            }
            else {
                res
                    .status(404)
                    .json(new utils_1.JsonResponse().error('Profile not found').build());
            }
        })
            .catch((err) => {
            res.status(401).json(new utils_1.JsonResponse().error(err.message).build());
        });
    }
    updateOrInsert(req, res) {
        var profile = new UserDTO_1.UserInformationDTO(req.body);
        profile.userId = res.locals.user.id;
        profile_service_1.default.update(res.locals.user.id, profile)
            .then((r) => {
            if (r) {
                res.status(200).json(new utils_1.JsonResponse().success(r).build());
            }
            else {
                res
                    .status(404)
                    .json(new utils_1.JsonResponse().error('User not found.').build());
            }
            cache_service_1.default.invalidateCache(profile_service_1.default.generateCacheKey(res.locals.user.id));
        })
            .catch((err) => {
            res.status(401).json(new utils_1.JsonResponse().error(err.message).build());
        });
    }
}
exports.UserProfileController = UserProfileController;
exports.default = new UserProfileController();
//# sourceMappingURL=controller.js.map