"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin = __importStar(require("firebase-admin"));
const memberCollection = admin.firestore().collection("Member");
exports.setMember = function (member) {
    return memberCollection.doc(member.id_Line).set(member, { merge: true });
};
exports.getMember = function (lineId) {
    return memberCollection.where("id_Line", "==", lineId).get();
};
