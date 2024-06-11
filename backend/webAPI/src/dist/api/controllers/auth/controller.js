"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authentication_service_1 = __importDefault(require("../../services/auth/authentication.service"));
class AuthController {
    login(req, res) {
        authentication_service_1.default.login(req).then((r) => {
            if (r) {
                res.status(200).json(r);
            }
            else {
                res.status(404).json(r);
            }
        }).catch((err) => {
            res.status(401).json(err.message);
        });
    }
    logout(_, res) {
        // AuthenticationService.logout();
        res.status(200).json({ message: "Logged out." });
    }
}
exports.AuthController = AuthController;
exports.default = new AuthController();
//# sourceMappingURL=controller.js.map