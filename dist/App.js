"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const index_1 = __importDefault(require("./api/index"));
const errorHandler = __importStar(require("./helpers/errorHandler"));
class App {
    constructor() {
        this.express = express_1.default();
        this.setMiddlewares();
        this.setRoutes();
        this.catchErrors();
    }
    setMiddlewares() {
        this.express.use(cors_1.default());
        this.express.use(morgan_1.default('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(helmet_1.default());
    }
    setRoutes() {
        this.express.use('/v1', index_1.default);
    }
    catchErrors() {
        this.express.use(errorHandler.notFound);
        this.express.use(errorHandler.internalServerError);
    }
}
exports.default = new App().express;
//# sourceMappingURL=App.js.map