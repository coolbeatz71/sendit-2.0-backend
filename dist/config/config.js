"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.default = {
    APP: process.env.APP || 'development',
    PORT: process.env.PORT || '3000',
    DB_DIALECT: process.env.DB_DIALECT || 'mongo',
    DB_HOST: process.env.DB_HOST || 'mongodb://localhost:27017/example_db',
    DB_NAME: process.env.DB_NAME || 'example_db',
    DB_PASSWORD: process.env.DB_PASSWORD || 'db-password',
    DB_PORT: process.env.DB_PORT || '27017',
    DB_USER: process.env.DB_USER || 'root',
    JWT_ENCRYPTION: process.env.JWT_ENCRYPTION || 'jwt_please_change',
    JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1h',
    SALT_ROUNDS: process.env.SALT_ROUNDS || 10,
};
//# sourceMappingURL=config.js.map