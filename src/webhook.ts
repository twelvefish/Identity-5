import express = require('express')

import * as Line from '@line/bot-sdk'
import { LineConfig } from './config'
import { WebhookEvent } from '@line/bot-sdk';

import * as lineServices from '../apiServices/lineServices'
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
                if (event.source.type == 'group') {
                    lineServices.welcomeAction(event.replyToken, event.source.groupId, event.joined.members[0].userId)
                    lineServices.checkUserExist(event.source.groupId, String(event.source.userId))
                }
                break
            case 'memberLeft':
                if (event.source.type == 'group') {
                    lineServices.leaveAction(event.source.groupId, event.left.members[0].userId)
                }
                break
            case 'message':
                if (event.source.type == 'group') {
                    switch (event.message.type) {
                        case 'text':
                            lineServices.text(event.source, event.message, event.timestamp)
                            lineServices.checkUserExist(event.source.groupId, String(event.source.userId))
                            break
                        case 'image':
                        lineServices.image(event.message.id)
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

module.exports = router