import express = require('express')

import * as Line from '@line/bot-sdk'
import { LineConfig } from './config'
import { WebhookEvent } from '@line/bot-sdk';

import * as lineServices from '../services/apiServices/lineServices'
import * as imgurServices from '../services/apiServices/imgurServices';
import * as  personalDataServices from '../services/controllerServices/personalDataServices'

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
                    // personalDataServices.teachIdentity(event.replyToken)
                }
                break
            case 'memberLeft':
                if (event.source.type == 'group') {
                    // lineServices.leaveAction(event.source.groupId, event.left.members[0].userId)
                }
                break
            case 'message':
                if (event.source.type == 'group') {
                    let groupId = event.source.groupId
                    switch (event.message.type) {
                        case 'text':
                            if (event.message.text.indexOf('狐狸') != -1) {
                                lineServices.keywords(event.replyToken, '狐狸大變態')
                            } else if (event.message.text.indexOf('爆炸') != -1) {
                                lineServices.keywords(event.replyToken, '爆炸易燃物')
                            } else if (event.message.text.indexOf('首領') != -1) {
                                lineServices.keywords(event.replyToken, '變態首領狐狸')
                            }
                            lineServices.text(event.replyToken, event.source, event.message, event.timestamp)
                            lineServices.checkUserExist(groupId, String(event.source.userId))
                            break
                        // case 'image':
                        //     lineServices.convertLineMessageContent(event.message.id).then(async image => {
                        //         let link = await imgurServices.uplodeImgur(image)
                        //         lineServices.image("C3a9ad0efde2526184d4d274b6b940241", link)
                        //     })

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