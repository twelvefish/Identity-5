"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const config = __importStar(require("../src/config"));
var imgur = require('imgur');
imgur.setClientId(config.imgurCilentId);
exports.uplodeImgur = (stream) => {
    return new Promise((resolve, reject) => {
        imgur.uploadBase64(stream)
            .then(function (json) {
            console.error("===Upload Imgur Success===", json.data.link);
            resolve(json.data.link);
        })
            .catch(function (err) {
            console.error("===Upload Imgur Err===", err.message);
            reject(err.message);
        });
    });
};
