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
    let responseArray = [];
    events.forEach(event => {
        console.log(JSON.stringify(event, null, 4));
        switch (event.type) {
            case 'memberJoined':
                if (event.source.type == 'group') {
                    const source = event.source;
                    lineServices.welcomeAction(event);
                    // lineServices.checkUserExist(source.groupId, String(source.userId))
                }
                break;
            case 'memberLeft':
                lineServices.leaveAction(event);
                break;
            case 'message':
                if (event.source.type == 'group') {
                    const source = event.source;
                    switch (event.message.type) {
                        case 'text':
                            lineServices.text(source, event.message, event.timestamp);
                            lineServices.checkUserExist(source.groupId, String(source.userId));
                            break;
                        default:
                            break;
                    }
                }
                break;
            default:
                break;
        }
    });
    Promise
        .all(responseArray)
        .then((result) => {
        res.json(result);
        res.status(200).end();
    })
        .catch((err) => {
        console.error("err", err);
        res.status(500).end();
    });
});
// const handleEvent = (event: any) => {
//     if (event.type !== 'message' || event.message.type !== 'text') {
//         return Promise.resolve(null);
//     }
//     const echo: TextMessage = { type: 'text', text: String(event.message.text) };
//     return lineClient.replyMessage(event.replyToken, echo);
// }
module.exports = router;
