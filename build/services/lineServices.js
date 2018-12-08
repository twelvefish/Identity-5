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
            console.log("member123", member);
            const welcome = {
                type: "text",
                text: `歡迎新來的${member.displayName}萌新😊\n\n` +
                    `\t\t\t\t記事本看下規則，記得按下符號表示看過\uDBC0\uDC09，有任何事情請召喚群管，歡迎一起歡樂開黑玩遊戲～\n\n` +
                    `\t\t\t\t記得動動小手把群組提醒關掉🙈🙈🙈，這裡有點熱鬧\uDBC0\uDC35`
            };
            const welcomePic = {
                type: "image",
                originalContentUrl: member.pictureUrl,
                previewImageUrl: member.pictureUrl
            };
            linePushServices_1.pushMessages(groupId, [welcome, welcomePic]);
        }).catch(err => console.log(err));
    }
};
