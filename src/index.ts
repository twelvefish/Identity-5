import express = require('express')
import { serviceAccountKey } from './config'

const app = express()//建立一個Express伺服器
const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey)
})

const webhook = require('./webhook')

app.use('/', webhook)

app.listen(process.env.PORT || 3000, () => {
    console.log('Express server listening on port 3000')
})