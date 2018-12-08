"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Line = __importStar(require("@line/bot-sdk"));
const config_1 = require("./config");
const lineServices = __importStar(require("../services/lineServices"));
var router = express.Router();
router.use(function (req, res, next) {
    console.log("輸出記錄訊息至終端機", req.method, req.url);
    next();
});
router.post('/webhook', Line.middleware(config_1.LineConfig), (req, res) => {
    const events = req.body.events;
    events.forEach(event => {
        console.log(JSON.stringify(event, null, 4));
        switch (event.type) {
            case 'memberJoined':
                lineServices.welcomeMessage(event);
                break;
            default:
                break;
        }
    });
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
        console.error("err", err);
        res.status(500).end();
    });
});
const handleEvent = (event) => {
    return true;
    //     if (event.type !== 'message' || event.message.type !== 'text') {
    //         return Promise.resolve(null);
    //     }
    //     const echo: TextMessage = { type: 'text', text: String(event.message.text) };
    //     return lineClient.replyMessage(event.replyToken, echo);
};
module.exports = router;
