import { Profile } from "@line/bot-sdk";

// export const LineConfig = {
//     channelId: "1629115709",
//     channelSecret: "77a19e95c76517d69dd5cf8c9f04ee1c",
//     channelAccessToken: "stA5rm/UWrcmv9rjmqhK2IsQIwCXnRD/Ap1NRkjqaNAKihyVRV+AQamkc4bC+BGhBki0H7TIoCBaMBMPZjKvZxDHwoAYcUdYAoZGU+ohXYIAyRL9nMnEodHQXp7aFJ2Sk3wUHLSOyFkPoJmYZnsfxgdB04t89/1O/w1cDnyilFU="
// }

export const LineConfig = {
    channelId: "1629115709",
    channelSecret: String(process.env.channelSecret),
    channelAccessToken: String(process.env.channelAccessToken)
}

// 測試號
// export const LineConfig = {
//     channelId: "1629838735",
//     channelSecret: "d91d59e2249d00223f1aa4a35a00f665",
//     channelAccessToken: "UhR1oq9Cq5aUtJTAiRlSpILu4nt9yskG3gu0jIAtq+LbnYGLfwUuNntnuImwH5xi99BDthgmHkywsyTrZOLzR9kRuhFdV0zC43eTsszLKjFRxifhHCQffs1vMccLwTiADLpaO+PbcQheKQQ1t/2ISQdB04t89/1O/w1cDnyilFU="
// }

export const picUrl = "https://firebasestorage.googleapis.com/v0/b/identity-5.appspot.com/o/%E5%8E%BB%E5%93%AA%E8%B2%B7%E5%A4%A7%E9%A0%AD%E8%B2%BC.jpg?alt=media&token=1ae3fec6-fcb6-41e9-a2bc-f7757b4b3990"

export const imgurToken = "c5388ccbfdef3f0cce9563d98f5d21392831ad42"
export const imgurCilentId = "13c8c3e89c7fd4c"
