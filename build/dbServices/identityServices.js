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
const identityCollection = admin.firestore().collection("Identity");
exports.setIdentity = function (identity) {
    return identityCollection.doc(identity.id).set(identity, { merge: true });
};
exports.getIdentityByUserId = function (userId) {
    return identityCollection.where("userId", "==", userId).get().then(snapshot => {
        return snapshot.docs.map(doc => {
            return doc.data();
        });
    });
};
exports.getIdentitys = function () {
    return identityCollection.get().then(snapshot => {
        return snapshot.docs.map(doc => {
            return doc.data();
        });
    });
};
