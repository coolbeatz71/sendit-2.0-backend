"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config"));
mongoose_1.default.set('useCreateIndex', true);
// Connecting to the database
exports.default = (async () => {
    try {
        await mongoose_1.default.connect(config_1.default.DB_HOST, { useNewUrlParser: true });
        // listen for requests
        console.log('The Conection is Ok');
    }
    catch (err) {
        console.log(`${err} Could not Connect to the Database. Exiting Now...`);
        process.exit();
    }
})();
//# sourceMappingURL=db.js.map