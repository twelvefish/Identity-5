import * as Line from '@line/bot-sdk'
import { LineConfig } from '../src/config'
const lineClient = new Line.Client(LineConfig)
import { MemberJoinEvent, TextEventMessage, TextMessage, Group, Profile } from '@line/bot-sdk';
import { pushMessages } from '../services/linePushServices'
import * as  memberServices from '../dbServices/memberServices'
import { Member } from '../src/model';

export const welcomeMessage = (event: MemberJoinEvent) => {
    if (event.source.type == 'group') {
        const groupId = event.source.groupId
        const lineId = event.joined.members[0].userId

        lineClient.getGroupMemberProfile(groupId, lineId).then(member => {
            console.log("member", member)
            const welcome: any = {
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
            }
            pushMessages(groupId, [welcome])
        }).catch(err => console.log(err))
    }
}

export const text = (source: Group, event: TextEventMessage, timestamp: number) => {
    const text = event.text
    const groupId = source.groupId
    const lineId = source.userId ? source.userId : ''
    lineClient.getGroupMemberProfile(source.groupId, lineId).then(member => {
        if (text.startsWith('波妞設定', 0)) {
            setMember(groupId, member, text.slice(5, text.length), timestamp)
        } else if (text == '波妞個資') {
            findMember(groupId, member)
        } else if (text.startsWith('波妞查詢', 0)) {
            // searchMemberData()
        } else if (text.indexOf('髒') != -1 || text.indexOf('骨葬') != -1) {
            dirtyWords(groupId)
        }
    })
}

const dirtyWords = (groupId: string) => {
    const message: TextMessage = {
        type: "text",
        text: "大膽奴才.....你才髒 ! ! !\n你全家都髒"
    }
    pushMessages(groupId, [message])
}

const setMember = (groupId: string, memberLine: Profile, text: string, timestamp: number) => {
    console.log("===使用者輸入===", text)
    let level: number = 0
    const levelString = text.split(" ")[2] ? text.split(" ")[2] : ''
    if (levelString) {
        if (levelString.indexOf('1') != -1 || levelString.indexOf('一') != -1 || levelString.indexOf('壹') != -1) {
            level = 1
        } else if (levelString.indexOf('2') != -1 || levelString.indexOf('二') != -1 || levelString.indexOf('貳') != -1) {
            level = 2
        } else if (levelString.indexOf('3') != -1 || levelString.indexOf('三') != -1 || levelString.indexOf('參') != -1) {
            level = 3
        } else if (levelString.indexOf('4') != -1 || levelString.indexOf('四') != -1 || levelString.indexOf('肆') != -1) {
            level = 4
        } else if (levelString.indexOf('5') != -1 || levelString.indexOf('五') != -1 || levelString.indexOf('伍') != -1) {
            level = 5
        } else if (levelString.indexOf('6') != -1 || levelString.indexOf('六') != -1 || levelString.indexOf('陸') != -1) {
            level = 6
        } else {
            level = 0
        }
    }
    let member: Member = {
        id_Line: memberLine.userId,
        name_Line: memberLine.displayName,
        id_Game: text.split(" ")[1],
        name_Game: text.split(" ")[0],
        level: level,
        remarks: text.split(" ")[3] ? text.split(" ")[3] : '',
        timestamp: timestamp
    }
    console.log("===member===", member)
    if (level != 0) {
        memberServices.setMember(member).then(data => {
            pushMessages(groupId, [{
                type: "text",
                text: `波妞對你說 : 恭喜${member.name_Line}第五人格個資設定成功`
            }])
        }).catch(() => {
            pushMessages(groupId, [{
                type: "text",
                text: `波妞對你說 : ${member.name_Line}出現未知的錯誤，請重新嘗試一遍`
            }])
        })
    } else {
        pushMessages(groupId, [{
            type: "text",
            text: "波妞對你說 : Sor，階層輸入錯誤"
        }])
    }
}

const findMember = (groupId: string, memberLine: Profile) => {
    memberServices.getMember(memberLine.userId).then(memberSnapshot => {
        if (!memberSnapshot.empty) {
            let member = memberSnapshot.docs[0].data() as Member
            let message: string = ''
            if (member.remarks) {
                message = `備註   :${member.remarks}`
            }
            pushMessages(groupId, [{
                type: "text",
                text: "波妞~波妞~\n\n" +
                    `Line姓名  : ${memberLine.displayName}\n` +
                    `遊戲姓名 : ${member.name_Game}\n` +
                    `遊戲ID    : ${member.id_Game}\n` +
                    `位階       : ${member.level}階\n` + message
            }])
        } else {
            pushMessages(groupId, [{
                type: "text",
                text: "波妞對你說 :Sor，你的個資不存在，請重新進行設定\n\n" +
                    "第五人格個資基本設定(給我用半型空白)\n\n" +
                    "波妞設定 遊戲名稱 遊戲ID 幾階 備註\n" +
                    "波妞個資\n" +
                    "波妞查詢 (Line名稱 / 遊戲名稱 / 遊戲ID / 幾階 / 備註)"
            }])
        }
    })
}
