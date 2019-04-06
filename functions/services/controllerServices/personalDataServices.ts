import { TextMessage, Profile } from '@line/bot-sdk'
import { replyMessages } from '../apiServices/linePushServices'
import * as lineServices from '../apiServices/lineServices'
import * as  userServices from '../dbServices/userServices'
import * as  identityServices from '../dbServices/identityServices'
import { Identity } from '../../src/model'
import uuid = require('uuid');

export const dirtyWords = (replyToken: string) => {
    const message: TextMessage = {
        type: "text",
        text: "大膽奴才.....你才髒 ! ! !\n你全家都髒"
    }
    replyMessages(replyToken, [message])
}

export const setIdentity = (replyToken: string, groupId: string, memberLine: Profile, datas: string[], timestamp: number) => {
    console.log("===使用者輸入===", datas[1])
    console.log("===使用者輸入===", datas[2])
    console.log("===使用者輸入===", datas[3])
    console.log("===使用者輸入===", datas[4])
    let level: number = 0
    level = levelData(datas[3])
    if (!datas[4]) datas[4] = "無"
    if (level == 0) {
        replyMessages(replyToken, [{
            type: "text",
            text: "波妞對你說 : 位階輸入錯誤，請重新設定\n\n" +
                "第五人格個資設定(給我用半型空白)\n\n" +
                "波妞設定 遊戲角色名稱 遊戲ID 位階 備註\n"
        }])
    } else {
        userServices.getUserByLineId(memberLine.userId).then(users => {
            if (users.length == 0) {
                lineServices.checkUserExist(groupId, memberLine.userId)
                replyMessages(replyToken, [{
                    type: "text",
                    text: `波妞對你說 : ${memberLine.displayName}出現未知的錯誤，請重新嘗試一遍`
                }])
            } else {
                identityServices.getIdentityByUserId(users[0].id).then(identitys => {
                    if (identitys.length == 0) {
                        let identity: Identity = {
                            id: uuid.v4(),
                            userId: users[0].id,
                            lineId: memberLine.userId,
                            lineName: memberLine.displayName,
                            gameId: datas[2],
                            gameName: datas[1],
                            level: level + "階",
                            remarks: datas[4],
                            timestamp: timestamp
                        }
                        identityServices.setIdentity(identity).then(() => {
                            //之後要修改成將字串回傳回去讓lineServices去Call pushMessages
                            replyMessages(replyToken, [{
                                type: "text",
                                text: `波妞對你說 : 恭喜${memberLine.displayName}第五人格個資設定成功`
                            }])
                        }).catch(() => {
                            replyMessages(replyToken, [{
                                type: "text",
                                text: `波妞對你說 : ${memberLine.displayName}出現未知的錯誤，請重新嘗試一遍`
                            }])
                        })
                    } else {
                        let identity: Identity = {
                            id: identitys[0].id,
                            userId: users[0].id,
                            lineId: memberLine.userId,
                            lineName: memberLine.displayName,
                            gameId: datas[2],
                            gameName: datas[1],
                            level: level + "階",
                            remarks: datas[4],
                            timestamp: timestamp
                        }
                        identityServices.setIdentity(identity).then(() => {
                            //之後要修改成將字串回傳回去讓lineServices去Call pushMessages
                            replyMessages(replyToken, [{
                                type: "text",
                                text: `波妞對你說 : 恭喜${memberLine.displayName}第五人格個資更新成功`
                            }])
                        }).catch(() => {
                            replyMessages(replyToken, [{
                                type: "text",
                                text: `波妞對你說 : ${memberLine.displayName}出現未知的錯誤，請重新嘗試一遍`
                            }])
                        })
                    }
                })
            }
        })
    }

}

export const findIdentity = (replyToken: string, groupId: string, memberLine: Profile) => {
    userServices.getUserByLineId(memberLine.userId).then(users => {
        if (users.length == 0) {
            lineServices.checkUserExist(groupId, memberLine.userId)
            replyMessages(replyToken, [{
                type: "text",
                text: `波妞對你說 : ${memberLine.displayName}出現未知的錯誤，請重新嘗試一遍`
            }])
        } else {
            identityServices.getIdentityByUserId(users[0].id).then(identitys => {
                if (identitys.length == 0) {
                    replyMessages(replyToken, [{
                        type: "text",
                        text: "波妞對你說 : 位階輸入錯誤，請重新設定\n\n" +
                            "第五人格個資設定(給我用半型空白)\n\n" +
                            "波妞設定 遊戲角色名稱 遊戲ID 位階 備註\n"
                    }])
                } else {
                    replyMessages(replyToken, [{
                        type: "text",
                        text: "波妞~波妞~\n\n" +
                            `Line姓名  : ${memberLine.displayName}\n` +
                            `遊戲角色姓名 : ${identitys[0].gameName}\n` +
                            `遊戲ID    : ${identitys[0].gameId}\n` +
                            `位階       : ${identitys[0].level}\n` +
                            `備註       : ${identitys[0].remarks}`
                    }])
                }
            })
        }
    })
}

export const searchIdentity = (replyToken: string, datas: string[]) => {

    identityServices.getIdentitys().then((identitys: any) => {
        if (identitys.length > 0) {
            let matchMember: string = "序號，Line姓名，遊戲角色姓名，遊戲ID，位階，備註\n\n"
            let count = 1
            for (let identity of identitys) {
                Object.keys(identity).map(key => {
                    if (key != "timestamp" && key != "lineId" && key != "userId" && key != "id" && key != "gameId") {
                        if (String(identity[key]).indexOf(datas[1]) != -1 && matchMember.indexOf(identity.lineName) == -1 && matchMember.indexOf(identity.gameId) == -1) {
                            let data = `${count}、${identity.lineName}，${identity.gameName}，${identity.gameId}，${identity.level}，${identity.remarks}\n`
                            matchMember = matchMember + data + "\n"
                            count = count + 1
                        }
                    }
                })
            }

            if (matchMember == "序號，Line姓名，遊戲角色姓名，遊戲ID，位階，備註\n\n") {
                matchMember = matchMember + "目前系統並無相對應的匹配資料\n"
            }

            replyMessages(replyToken, [{
                type: "text",
                text: matchMember
            }])

        } else {
            replyMessages(replyToken, [{
                type: "text",
                text: "波妞對你說 : 系統欠缺資料，請大家踴躍提供"
            }])
        }
    })
}

export const teachIdentity = (replyToken: string) => {
    replyMessages(replyToken, [{
        type: "text",
        text: "↓↓請復製下列文字 / 將內容改成你的↓↓\n\n波妞設定 可愛園丁 12345678 6階 備註"
    }, {
        type: "image",
        originalContentUrl: "https://i.imgur.com/V0ZjZWZ.jpg",
        previewImageUrl: "https://i.imgur.com/V0ZjZWZ.jpg"
    }])
}

const levelData = (level: string): number => {
    if (level) {
        if (level.indexOf('1') != -1 || level.indexOf('一') != -1 || level.indexOf('壹') != -1) {
            return 1
        } else if (level.indexOf('2') != -1 || level.indexOf('二') != -1 || level.indexOf('貳') != -1) {
            return 2
        } else if (level.indexOf('3') != -1 || level.indexOf('三') != -1 || level.indexOf('參') != -1) {
            return 3
        } else if (level.indexOf('4') != -1 || level.indexOf('四') != -1 || level.indexOf('肆') != -1) {
            return 4
        } else if (level.indexOf('5') != -1 || level.indexOf('五') != -1 || level.indexOf('伍') != -1) {
            return 5
        } else if (level.indexOf('6') != -1 || level.indexOf('六') != -1 || level.indexOf('陸') != -1) {
            return 6
        } else {
            return 0
        }
    } else {
        return 0
    }
}