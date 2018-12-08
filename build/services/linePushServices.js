"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Line = __importStar(require("@line/bot-sdk"));
const config_1 = require("../src/config");
const lineClient = new Line.Client(config_1.LineConfig);
exports.pushMessages = (userId, messages) => {
    messages.forEach(message => {
        lineClient.pushMessage(userId, message);
    });
};
