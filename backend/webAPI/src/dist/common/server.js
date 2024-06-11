"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = __importDefault(require("http"));
const os_1 = __importDefault(require("os"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const logger_1 = __importDefault(require("./logger"));
const cors_1 = __importDefault(require("cors"));
const error_handler_1 = __importDefault(require("../api/middlewares/error.handler"));
const app = (0, express_1.default)();
class ExpressServer {
    constructor() {
        // Normalize the root path of the project
        const root = path_1.default.normalize(__dirname + '/../..');
        // Enable Cross-Origin Resource Sharing
        app.use((0, cors_1.default)());
        // Use body-parser middleware to parse incoming JSON requests
        app.use(body_parser_1.default.json({ limit: process.env.REQUEST_LIMIT || '100kb' }));
        // Use body-parser middleware to parse incoming URL-encoded requests
        app.use(body_parser_1.default.urlencoded({
            extended: true,
            limit: process.env.REQUEST_LIMIT || '100kb',
        }));
        // Use body-parser middleware to parse incoming text requests
        app.use(body_parser_1.default.text({ limit: process.env.REQUEST_LIMIT || '100kb' }));
        // Use cookie-parser middleware to parse cookies attached to the client request object
        app.use((0, cookie_parser_1.default)(process.env.SESSION_SECRET));
        // Serve static files from the 'public' directory
        app.use(express_1.default.static(`${root}/public`));
        // Define the path to the OpenAPI specification file
        const apiSpec = path_1.default.join(__dirname, 'api.yml');
        // Determine whether to validate responses against the OpenAPI specification
        const validateResponses = !!(process.env.OPENAPI_ENABLE_RESPONSE_VALIDATION &&
            process.env.OPENAPI_ENABLE_RESPONSE_VALIDATION.toLowerCase() === 'true');
        // Serve the OpenAPI specification file at the path specified by the OPENAPI_SPEC environment variable or default to '/spec'
        app.use(process.env.OPENAPI_SPEC || '/spec', express_1.default.static(apiSpec));
        // Use OpenAPI Validator middleware to validate incoming requests and outgoing responses against the OpenAPI specification
    }
    router(routes) {
        routes(app);
        app.use(error_handler_1.default);
        return this;
    }
    listen(port) {
        const welcome = (p) => () => logger_1.default.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os_1.default.hostname()} on port: ${p}}`);
        http_1.default.createServer(app).listen(port, welcome(port));
        return app;
    }
}
exports.default = ExpressServer;
//# sourceMappingURL=server.js.map