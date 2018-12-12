import * as admin from 'firebase-admin'
import { Member } from '../src/model'

const memberCollection = admin.firestore().collection("Member");

export const setMember = function (member: Member) {
    return memberCollection.doc(member.id_Line).set(member, { merge: true })
}