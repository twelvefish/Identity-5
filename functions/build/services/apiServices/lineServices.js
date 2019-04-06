"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Line = __importStar(require("@line/bot-sdk"));
const config = __importStar(require("../../src/config"));
const lineClient = new Line.Client(config.LineConfig);
const linePushServices_1 = require("../apiServices/linePushServices");
const personalDataServices = __importStar(require("../controllerServices/personalDataServices"));
const userServices = __importStar(require("../dbServices/userServices"));
const uuid_1 = __importDefault(require("uuid"));
let fs = require('fs');
exports.welcomeAction = (replyToken, groupId, lineId) => {
    lineClient.getGroupMemberProfile(groupId, lineId).then(member => {
        const welcomeMessage = welcomeFlexTemplate(member);
        linePushServices_1.replyMessages(replyToken, [welcomeMessage]);
    }).catch(err => console.log(err));
};
exports.leaveAction = (groupId, lineId) => {
    userServices.getUserByLineId(lineId).then(users => {
        if (users.length == 0) {
            const leaveMessage = {
                type: "text",
                text: `系統提示《未知對象》已退出群組，讓我們忘記他...`
            };
            linePushServices_1.pushMessages(groupId, [leaveMessage]);
        }
        else {
            const leaveMessage = {
                type: "text",
                text: `系統提示《${users[0].name}》已退出群組，讓我們緬懷他XD`
            };
            linePushServices_1.pushMessages(groupId, [leaveMessage]);
        }
    }).catch(err => {
        console.log("===User讀取失敗===", err);
    });
};
exports.text = (replyToken, source, event, timestamp) => {
    const text = event.text;
    const groupId = source.groupId;
    const lineId = source.userId ? source.userId : '';
    lineClient.getGroupMemberProfile(source.groupId, lineId).then(member => {
        const datas = text.trim().split(/\s+/);
        console.log("datas", datas);
        switch (datas[0]) {
            case '波妞設定':
                personalDataServices.setIdentity(replyToken, groupId, member, datas, timestamp);
                break;
            case '波妞個資':
                personalDataServices.findIdentity(replyToken, groupId, member);
                break;
            case '波妞查詢':
                personalDataServices.searchIdentity(replyToken, datas);
                break;
            case '波妞教學':
                personalDataServices.teachIdentity(replyToken);
                break;
            default:
                break;
        }
    });
};
exports.image = (groupId, link) => {
    const imageMessage = {
        type: "image",
        originalContentUrl: `${link}`,
        previewImageUrl: `${link}`
    };
    linePushServices_1.pushMessages(groupId, [imageMessage]);
};
exports.convertLineMessageContent = (messageId) => {
    return lineClient.getMessageContent(messageId).then((stream) => {
        return new Promise((resolve, reject) => {
            // const writable = fs.createWriteStream('aaa.jpg');
            // stream.pipe(writable);
            let chunks = [];
            stream.on('data', (chunk) => {
                chunks.push(chunk);
            });
            stream.on('end', (err) => {
                let data = Buffer.concat(chunks);
                var base64Img = data.toString('base64');
                resolve(base64Img);
            });
            stream.on('error', reject);
        });
    });
};
exports.checkUserExist = (groupId, lineId) => {
    lineClient.getGroupMemberProfile(groupId, lineId).then(member => {
        userServices.getUserByLineId(member.userId).then(users => {
            if (users.length == 0) {
                let user = {
                    id: uuid_1.default.v4(),
                    name: member.displayName,
                    picUrl: member.pictureUrl ? member.pictureUrl : '',
                    lineId: member.userId
                };
                userServices.setUser(user).then(() => {
                    console.log("===User新增成功===");
                }).catch(err => {
                    console.log("===User新增失敗===", err);
                });
            }
            else {
                let user = {
                    id: users[0].id,
                    name: member.displayName,
                    picUrl: member.pictureUrl ? member.pictureUrl : '',
                    lineId: member.userId
                };
                userServices.setUser(user).then(() => {
                    console.log("===User更新成功===");
                }).catch(err => {
                    console.log("===User更新失敗===", err);
                });
            }
        });
    }).catch(err => {
        console.log("===和Line交換User資料失敗===", err);
    });
};
const welcomeFlexTemplate = (member) => {
    return {
        type: "flex",
        altText: "第五人格歡樂唱",
        contents: {
            "type": "bubble",
            "hero": {
                "type": "image",
                "url": member.pictureUrl ? member.pictureUrl : config.picUrl,
                "size": "full",
                "aspectRatio": "20:20",
                "aspectMode": "cover",
                "action": {
                    "type": "uri",
                    "uri": member.pictureUrl ? member.pictureUrl : config.picUrl
                }
            },
            "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": "第五人格歡樂玩",
                        "weight": "bold",
                        "size": "xl"
                    },
                    {
                        "type": "box",
                        "layout": "vertical",
                        "margin": "lg",
                        "spacing": "sm",
                        "contents": [
                            {
                                "type": "box",
                                "layout": "baseline",
                                "spacing": "sm",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": `歡迎新來的${member.displayName}萌新😊\n\n` +
                                            `\t\t\t\t記事本看下規則，記得按下符號表示看過，有任何事情請召喚群管，歡迎一起歡樂開黑玩遊戲～\n\n` +
                                            `\t\t\t\t記得動動小手把群組提醒關掉🙈🙈🙈，這裡有點熱鬧💘💘`,
                                        "wrap": true,
                                        "color": "#666666",
                                        "size": "sm",
                                        "flex": 5
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            "footer": {
                "type": "box",
                "layout": "vertical",
                "spacing": "sm",
                "contents": [
                    {
                        "type": "button",
                        "style": "link",
                        "height": "sm",
                        "action": {
                            "type": "uri",
                            "label": "Discord網址在這唷",
                            "uri": "https://discord.gg/BZgmVBw"
                        }
                    },
                    {
                        "type": "spacer",
                        "size": "sm"
                    }
                ],
                "flex": 0
            }
        }
    };
};
