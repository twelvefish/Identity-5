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
const userCollection = admin.firestore().collection("User");
exports.setUser = function (user) {
    return userCollection.doc(user.id).set(user, { merge: true });
};
exports.getUserByLineId = function (lineId) {
    return userCollection.where("lineId", "==", lineId).get().then(snapshot => {
        return snapshot.docs.map(doc => {
            return doc.data();
        });
    });
};
exports.getUsers = function () {
    return userCollection.get().then(snapshot => {
        return snapshot.docs.map(doc => {
            return doc.data();
        });
    });
};
