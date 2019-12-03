"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatus = __importStar(require("http-status"));
// handle not found errors
exports.notFound = (_req, res, _next) => {
    res.status(httpStatus.NOT_FOUND);
    res.json({
        message: 'Requested Resource Not Found',
        success: false,
    });
    res.end();
};
// handle internal server errors
exports.internalServerError = (err, _req, res, _next) => {
    res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR);
    res.json({
        message: err.message,
        extra: err.extra,
        errors: err,
    });
    res.end();
};
//# sourceMappingURL=errorHandler.js.map