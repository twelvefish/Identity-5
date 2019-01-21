"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const lineServices = __importStar(require("../apiServices/lineServices"));
const imgurServices = __importStar(require("../apiServices/imgurServices"));
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
                    lineServices.welcomeAction(event.replyToken, event.source.groupId, event.joined.members[0].userId);
                    lineServices.checkUserExist(event.source.groupId, String(event.source.userId));
                }
                break;
            case 'memberLeft':
                if (event.source.type == 'group') {
                    lineServices.leaveAction(event.source.groupId, event.left.members[0].userId);
                }
                break;
            case 'message':
                if (event.source.type == 'group') {
                    let groupId = event.source.groupId;
                    switch (event.message.type) {
                        case 'text':
                            lineServices.text(event.source, event.message, event.timestamp);
                            lineServices.checkUserExist(groupId, String(event.source.userId));
                            break;
                        case 'image':
                            lineServices.convertLineMessageContent(event.message.id).then((image) => __awaiter(this, void 0, void 0, function* () {
                                let link = yield imgurServices.uplodeImgur(image);
                                lineServices.image("C3a9ad0efde2526184d4d274b6b940241", link);
                            }));
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
module.exports = router;
