import express = require('express')

import * as Line from '@line/bot-sdk'
import { LineConfig } from './config'
import { WebhookEvent } from '@line/bot-sdk';

import * as lineServices from '../services/lineServices'
var router = express.Router()

router.use(function (req, res, next) {
    console.log("輸出記錄訊息至終端機", req.method, req.url);
    next()
})

router.post('/webhook', Line.middleware(LineConfig), (req, res) => {
    const events: WebhookEvent[] = req.body.events
    let responseArray: Promise<any>[] = []
    events.forEach(event => {
        console.log(JSON.stringify(event, null, 4))
        switch (event.type) {
            case 'memberJoined':
                lineServices.welcomeMessage(event)
                break
            case 'message':
                if (event.source.type == 'group') {
                    const source = event.source
                    switch (event.message.type) {
                        case 'text':
                        lineServices.text(source, event.message,event.timestamp)
                            break
                        default:
                            break
                    }
                }
                break
            default:
                break
        }
    })
    Promise
        .all(responseArray)
        .then((result) => {
            res.json(result)
            res.status(200).end()
        })
        .catch((err) => {
            console.error("err", err)
            res.status(500).end()
        })
})


// const handleEvent = (event: any) => {
    //     if (event.type !== 'message' || event.message.type !== 'text') {
    //         return Promise.resolve(null);
    //     }
    //     const echo: TextMessage = { type: 'text', text: String(event.message.text) };
    //     return lineClient.replyMessage(event.replyToken, echo);
// }

module.exports = router