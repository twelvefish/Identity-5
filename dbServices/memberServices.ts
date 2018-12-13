import * as admin from 'firebase-admin'
import { Member } from '../src/model'

const memberCollection = admin.firestore().collection("Member");

export const setMember = function (member: Member) {
    return memberCollection.doc(member.id_Line).set(member, { merge: true })
}

export const getMember = function (lineId: string) {
    return memberCollection.where("id_Line", "==", lineId).get().then(snapshot => {
        return snapshot.docs.map(doc => {
            return doc.data() as Member
        })
    })
}

export const getMembers = function () {
    return memberCollection.get().then(snapshot => {
        return snapshot.docs.map(doc => {
            return doc.data() as Member
        })
    })
}