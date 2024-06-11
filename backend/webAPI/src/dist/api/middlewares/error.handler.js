"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function errorHandler(err, _req, res, _next) {
    const errors = err.errors || [{ message: err }];
    res.status(err.status || 500).json({ errors });
}
exports.default = errorHandler;
//# sourceMappingURL=error.handler.js.map