"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("./api/controllers/auth/router"));
const router_2 = __importDefault(require("./api/controllers/profile/router"));
const router_3 = __importDefault(require("./api/controllers/user/router"));
function routes(app) {
    app.get('/api/v1/', (_, res) => {
        res.status(200).json({ status: "success", message: 'API version 1 is ready.' });
    });
    app.use('/api/v1/auth', router_1.default);
    app.use('/api/v1/profile', router_2.default);
    app.use('/api/v1/users', router_3.default);
}
exports.default = routes;
;
//# sourceMappingURL=routes.js.map