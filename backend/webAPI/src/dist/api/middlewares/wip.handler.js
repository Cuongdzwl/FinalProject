"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wip = void 0;
function wip(_req, res, _next) {
    res.status(501).json({ errors: {
            status: 'W.I.P',
            message: 'This endpoint is a work in progress and is not yet implemented.',
        } });
}
exports.wip = wip;
//# sourceMappingURL=wip.handler.js.map