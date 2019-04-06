"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const config_1 = require("./config");
const app = express(); //建立一個Express伺服器
const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert(config_1.serviceAccountKey)
});
const webhook = require('./webhook');
app.use('/', webhook);
app.listen(process.env.PORT || 3000, () => {
    console.log('Express server listening on port 3000');
});
