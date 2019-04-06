import * as config from "../../src/config";

var imgur = require('imgur');
imgur.setClientId(config.imgurCilentId);

export const uplodeImgur = (stream: any): Promise<string> => {
    return new Promise((resolve, reject) => {
        imgur.uploadBase64(stream)
            .then(function (json: any) {
                console.error("===Upload Imgur Success===", json.data.link);
                resolve(json.data.link)
            })
            .catch(function (err: any) {
                console.error("===Upload Imgur Err===", err.message);
                reject(err.message)
            });
    })
}

