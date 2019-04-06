import * as admin from 'firebase-admin'
import { User } from '../../src/model'

const userCollection = admin.firestore().collection("User");

export const setUser = function (user: User) {
    return userCollection.doc(user.id).set(user, { merge: true })
}

export const getUserByLineId = function (lineId: string) {
    return userCollection.where("lineId", "==", lineId).get().then(snapshot => {
        return snapshot.docs.map(doc => {
            return doc.data() as User
        })
    })
}

export const getUsers = function () {
    return userCollection.get().then(snapshot => {
        return snapshot.docs.map(doc => {
            return doc.data() as User
        })
    })
}