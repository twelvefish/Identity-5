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
const config = __importStar(require("../src/config"));
const lineClient = new Line.Client(config.LineConfig);
const linePushServices_1 = require("../services/linePushServices");
const memberServices = __importStar(require("../dbServices/memberServices"));
const userServices = __importStar(require("../dbServices/userServices"));
const uuid_1 = __importDefault(require("uuid"));
exports.welcomeAction = (replyToken, groupId, lineId) => {
    lineClient.getGroupMemberProfile(groupId, lineId).then(member => {
        console.log("member", member);
        const welcomeMessage = config.welcomeMessage(member);
        // pushMessages(groupId, [welcomeMessage])
        linePushServices_1.replyMessages(replyToken, [welcomeMessage]);
    }).catch(err => console.log(err));
};
exports.leaveAction = (event) => {
    if (event.source.type == 'group') {
        const groupId = event.source.groupId;
        const lineId = event.left.members[0].userId;
        console.log("groupId", groupId);
        console.log("lineId", lineId);
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
    }
};
exports.text = (source, event, timestamp) => {
    const text = event.text;
    const groupId = source.groupId;
    const lineId = source.userId ? source.userId : '';
    lineClient.getGroupMemberProfile(source.groupId, lineId).then(member => {
        if (text.startsWith('波妞設定', 0)) {
            setMember(groupId, member, text.slice(5, text.length), timestamp);
        }
        else if (text == '波妞個資') {
            findMember(groupId, member);
        }
        else if (text.startsWith('波妞查詢', 0)) {
            searchMember(groupId, member, text.slice(5, text.length));
        }
        else if (text.indexOf('髒') != -1 || text.indexOf('骨葬') != -1) {
            dirtyWords(groupId);
        }
    });
};
const dirtyWords = (groupId) => {
    const message = {
        type: "text",
        text: "大膽奴才.....你才髒 ! ! !\n你全家都髒"
    };
    linePushServices_1.pushMessages(groupId, [message]);
};
const setMember = (groupId, memberLine, text, timestamp) => {
    console.log("===使用者輸入===", text);
    let level = 0;
    const levelString = text.split(" ")[2] ? text.split(" ")[2] : '';
    if (levelString) {
        if (levelString.indexOf('1') != -1 || levelString.indexOf('一') != -1 || levelString.indexOf('壹') != -1) {
            level = 1;
        }
        else if (levelString.indexOf('2') != -1 || levelString.indexOf('二') != -1 || levelString.indexOf('貳') != -1) {
            level = 2;
        }
        else if (levelString.indexOf('3') != -1 || levelString.indexOf('三') != -1 || levelString.indexOf('參') != -1) {
            level = 3;
        }
        else if (levelString.indexOf('4') != -1 || levelString.indexOf('四') != -1 || levelString.indexOf('肆') != -1) {
            level = 4;
        }
        else if (levelString.indexOf('5') != -1 || levelString.indexOf('五') != -1 || levelString.indexOf('伍') != -1) {
            level = 5;
        }
        else if (levelString.indexOf('6') != -1 || levelString.indexOf('六') != -1 || levelString.indexOf('陸') != -1) {
            level = 6;
        }
        else {
            level = 0;
        }
    }
    let member = {
        id_Line: memberLine.userId,
        name_Line: memberLine.displayName,
        id_Game: text.split(" ")[1],
        name_Game: text.split(" ")[0],
        level: level,
        remarks: text.split(" ")[3] ? text.split(" ")[3] : '',
        timestamp: timestamp
    };
    console.log("===member===", member);
    if (level != 0) {
        memberServices.setMember(member).then(data => {
            linePushServices_1.pushMessages(groupId, [{
                    type: "text",
                    text: `波妞對你說 : 恭喜${member.name_Line}第五人格個資設定成功`
                }]);
        }).catch(() => {
            linePushServices_1.pushMessages(groupId, [{
                    type: "text",
                    text: `波妞對你說 : ${member.name_Line}出現未知的錯誤，請重新嘗試一遍`
                }]);
        });
    }
    else {
        linePushServices_1.pushMessages(groupId, [{
                type: "text",
                text: "波妞對你說 : Sor，階層輸入錯誤"
            }]);
    }
};
const findMember = (groupId, memberLine) => {
    memberServices.getMember(memberLine.userId).then(members => {
        if (members.length > 0) {
            let message = '';
            if (members[0].remarks) {
                message = `備註       : ${members[0].remarks}`;
            }
            linePushServices_1.pushMessages(groupId, [{
                    type: "text",
                    text: "波妞~波妞~\n\n" +
                        `Line姓名  : ${memberLine.displayName}\n` +
                        `遊戲姓名 : ${members[0].name_Game}\n` +
                        `遊戲ID    : ${members[0].id_Game}\n` +
                        `位階       : ${members[0].level}階\n` + message
                }]);
        }
        else {
            linePushServices_1.pushMessages(groupId, [{
                    type: "text",
                    text: "波妞對你說 :Sor，你的個資不存在，請重新進行設定\n\n" +
                        "第五人格個資基本設定(給我用半型空白)\n\n" +
                        "波妞設定 遊戲名稱 遊戲ID 幾階 備註\n" +
                        "波妞個資\n" +
                        "波妞查詢 (Line名稱 / 遊戲名稱 / 遊戲ID / 幾階 / 備註)"
                }]);
        }
    });
};
const searchMember = (groupId, memberLine, text) => {
    let keyWords = text.split(" ")[0];
    console.log("===keyWords===", keyWords);
    memberServices.getMembers().then((members) => {
        if (members.length > 0) {
            let matchMember = "序號，Line姓名，遊戲姓名，遊戲ID，位階，備註\n\n";
            let count = 1;
            for (let member of members) {
                Object.keys(member).map(key => {
                    if (key != "timestamp" && key != "id_Line") {
                        if (String(member[key]).indexOf(keyWords) != -1 && matchMember.indexOf(member.name_Line) == -1 && matchMember.indexOf(member.id_Game) == -1) {
                            let data = `${count}、${member.name_Line}，${member.name_Game}，${member.id_Game}，${member.level}階`;
                            if (member.remarks) {
                                data = data + `，${member.remarks}`;
                            }
                            matchMember = matchMember + data + "\n";
                            count = count + 1;
                        }
                    }
                });
            }
            if (matchMember == "序號，Line姓名，遊戲姓名，遊戲ID，位階，備註\n\n") {
                matchMember = matchMember + "目前系統並無相對應的匹配資料\n";
            }
            linePushServices_1.pushMessages(groupId, [{
                    type: "text",
                    text: matchMember
                }]);
        }
        else {
            linePushServices_1.pushMessages(groupId, [{
                    type: "text",
                    text: "波妞對你說 : 系統欠缺資料，請大家踴躍提供"
                }]);
        }
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
