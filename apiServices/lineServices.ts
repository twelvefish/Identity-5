import * as Line from '@line/bot-sdk'
import * as config from '../src/config'
const lineClient = new Line.Client(config.LineConfig)
import { TextEventMessage, TextMessage, Group, Profile, ImageMessage } from '@line/bot-sdk'
import { pushMessages, replyMessages } from '../apiServices/linePushServices'
import * as  personalDataServices from '../controllerServices/personalDataServices'
import * as  userServices from '../dbServices/userServices'
import { User } from '../src/model'
import uuid from 'uuid';
let fs = require('fs')

export const welcomeAction = (replyToken: string, groupId: string, lineId: string) => {
    lineClient.getGroupMemberProfile(groupId, lineId).then(member => {
        console.log("member", member)
        const welcomeMessage: any = welcomeFlexTemplate(member)
        replyMessages(replyToken, [welcomeMessage])
    }).catch(err => console.log(err))
}

export const leaveAction = (groupId: string, lineId: string) => {
    userServices.getUserByLineId(lineId).then(users => {
        if (users.length == 0) {
            const leaveMessage: TextMessage = {
                type: "text",
                text: `系統提示《未知對象》已退出群組，讓我們忘記他...`
            }
            pushMessages(groupId, [leaveMessage])
        } else {
            const leaveMessage: TextMessage = {
                type: "text",
                text: `系統提示《${users[0].name}》已退出群組，讓我們緬懷他XD`
            }
            pushMessages(groupId, [leaveMessage])
        }
    }).catch(err => {
        console.log("===User讀取失敗===", err)
    })
}

export const text = (source: Group, event: TextEventMessage, timestamp: number) => {
    const text = event.text
    const groupId = source.groupId
    const lineId = source.userId ? source.userId : ''
    lineClient.getGroupMemberProfile(source.groupId, lineId).then(member => {

        const datas = text.trim().split(/\s+/)
        console.log("datas", datas)
        switch (datas[0]) {
            case '波妞設定':
                personalDataServices.setIdentity(groupId, member, datas, timestamp)
                break
            case '波妞個資':
                personalDataServices.findIdentity(groupId, member)
                break
            case '波妞查詢':
                personalDataServices.searchIdentity(groupId, datas)
                break
            default:
                break
        }
    })
}

export const image = (groupId: string, link: string) => {
    const imageMessage: ImageMessage = {
        type: "image",
        originalContentUrl: `${link}`,
        previewImageUrl: `${link}`
    }
    pushMessages(groupId, [imageMessage])
}

export const convertLineMessageContent = (messageId: string): Promise<any> => {
    return lineClient.getMessageContent(messageId).then((stream: any) => {
        return new Promise((resolve, reject) => {
            // const writable = fs.createWriteStream('aaa.jpg');
            // stream.pipe(writable);
            let chunks: any[] = []
            stream.on('data', (chunk: any) => {
                chunks.push(chunk)
            });
            stream.on('end', (err: any) => {
                let data = Buffer.concat(chunks)
                var base64Img = data.toString('base64');
                resolve(base64Img)
            })
            stream.on('error', reject);
        })
    })
}

export const checkUserExist = (groupId: string, lineId: string) => {
    lineClient.getGroupMemberProfile(groupId, lineId).then(member => {
        userServices.getUserByLineId(member.userId).then(users => {
            if (users.length == 0) {
                let user: User = {
                    id: uuid.v4(),
                    name: member.displayName,
                    picUrl: member.pictureUrl ? member.pictureUrl : '',
                    lineId: member.userId
                }
                userServices.setUser(user).then(() => {
                    console.log("===User新增成功===")
                }).catch(err => {
                    console.log("===User新增失敗===", err)
                })
            } else {
                let user: User = {
                    id: users[0].id,
                    name: member.displayName,
                    picUrl: member.pictureUrl ? member.pictureUrl : '',
                    lineId: member.userId
                }
                userServices.setUser(user).then(() => {
                    console.log("===User更新成功===")
                }).catch(err => {
                    console.log("===User更新失敗===", err)
                })
            }
        })
    }).catch(err => {
        console.log("===和Line交換User資料失敗===", err)
    })

}

const welcomeFlexTemplate = (member: Profile): any => {
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
    }
}
