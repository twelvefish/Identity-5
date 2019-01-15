import * as admin from 'firebase-admin'
import { Identity } from '../src/model'

const identityCollection = admin.firestore().collection("Identity");

export const setIdentity = function (identity: Identity) {
    return identityCollection.doc(identity.id).set(identity, { merge: true })
}

export const getIdentityByUserId = function (userId: string) {
    return identityCollection.where("userId", "==", userId).get().then(snapshot => {
        return snapshot.docs.map(doc => {
            return doc.data() as Identity
        })
    })
}

export const getIdentitys = function () {
    return identityCollection.get().then(snapshot => {
        return snapshot.docs.map(doc => {
            return doc.data() as Identity
        })
    })
}