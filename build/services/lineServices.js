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
const linePushServices_1 = require("../services/linePushServices");
exports.welcomeMessage = (event) => {
    if (event.source.type == 'group') {
        const groupId = event.source.groupId;
        const lineId = event.joined.members[0].userId;
        lineClient.getGroupMemberProfile(groupId, lineId).then(member => {
            console.log("member", member);
            const welcome = {
                type: "flex",
                altText: "第五人格歡樂唱",
                contents: {
                    "type": "bubble",
                    "hero": {
                        "type": "image",
                        "url": member.pictureUrl,
                        "size": "full",
                        "aspectRatio": "20:13",
                        "aspectMode": "cover",
                        "action": {
                            "type": "uri",
                            "uri": member.pictureUrl
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
            linePushServices_1.pushMessages(groupId, [welcome]);
        }).catch(err => console.log(err));
    }
};
exports.text = (groupId, event) => {
    const text = event.text;
    if (text.indexOf('髒') == -1 || text.indexOf('骨葬') == -1) {
        dirtyWords(groupId);
    }
};
const dirtyWords = (groupId) => {
    const message = {
        type: "text",
        text: "大膽奴才.....你才髒 ! ! !\n你全家都髒"
    };
    linePushServices_1.pushMessages(groupId, [message]);
};
