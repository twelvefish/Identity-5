import * as Line from '@line/bot-sdk'
import { LineConfig } from '../src/config'
const lineClient = new Line.Client(LineConfig)

export const pushMessages = (userId: string, messages: any[]) => {
    messages.forEach(message => {
        lineClient.pushMessage(userId, message)
    })
}

export const replyMessages = (replyToken: string, messages: any[]) => {
        lineClient.replyMessage(replyToken, messages)
}