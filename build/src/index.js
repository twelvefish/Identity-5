"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express(); //建立一個Express伺服器
const webhook = require('./webhook');
app.use('/', webhook);
app.listen(process.env.PORT || 3000, () => {
    console.log('Express server listening on port 3000');
});
