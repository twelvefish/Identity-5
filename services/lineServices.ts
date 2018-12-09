import * as Line from '@line/bot-sdk'
import { LineConfig } from '../src/config'
const lineClient = new Line.Client(LineConfig)
import { TextMessage, MemberJoinEvent, ImageMessage } from '@line/bot-sdk';
import { pushMessages } from '../services/linePushServices'

export const welcomeMessage = (event: MemberJoinEvent) => {
    if (event.source.type == 'group') {
        const groupId = event.source.groupId
        const lineId = event.joined.members[0].userId

        lineClient.getGroupMemberProfile(groupId, lineId).then(member => {
            console.log("member123", member)

            const welcome: TextMessage = {
                type: "text",
                text: `歡迎新來的${member.displayName}萌新😊\n\n` +
                    `\t\t\t\t記事本看下規則，記得按下符號表示看過\uDBC0\uDC09，有任何事情請召喚群管，歡迎一起歡樂開黑玩遊戲～\n\n` +
                    `\t\t\t\t記得動動小手把群組提醒關掉🙈🙈🙈，這裡有點熱鬧\uDBC0\uDC35`
            }
            // const welcomePic: ImageMessage = {
            //     type: "image",
            //     originalContentUrl: member.pictureUrl,
            //     previewImageUrl: member.pictureUrl
            // }
            // pushMessages(groupId, [welcome, welcomePic])
            pushMessages(groupId, [welcome])
        }).catch(err => console.log(err))
    }
}