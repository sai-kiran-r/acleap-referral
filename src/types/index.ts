import { ReferralStatus } from "../utils/constants";

export type ACLPatient = {
    id?: any;
    fhirId?: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    ethnicity?: string;
    phone?: string;
    email?: string;
    gender?: string;
    age?: number;
    race?: string;
    address?: string;
    sexAtBirth?: string;
    genderIdentity?: string;
    sexualOrientation?: string;
}

export type ACLPatientQueue = {
    dateServed: string,
    referralId: string,
    summary: string,
    status: ReferralStatus,
    referralType: string,
    firstName: string,
    lastName: string,
}

// export type ACLPatientAlert = {
//     date?: string,
//     summary?: string,
//     status?: ReferralStatus,
//     referralType?: string,
//     firstName?: string,
//     lastName?: string,
// }

export type ACLServiceRequest = {
    [x:string]: any;
    dateCreated?: string,
    serviceRequested?: string,
    referralID?: string,
    intialReferralNote?: string,
    referralSource?: string,
    firstName?: string,
    lastName?: string,
    id?: number,

}

export type ACLActiveReferrals = {
    dateServed: string,
    lastName: string,
    firstName: string,
    status: ReferralStatus,
    serviceRequested: string,
    owner: string,
}

export type ACLArchiveReferrals = {
    dateServed: string,
    lastName: string,
    firstName: string,
    status: ReferralStatus,
    serviceRequested: string,
    owner: string,
}

export type ACLPatientNoteHistory = {
    id: any,
    noteText: string,
    author: string,
    owner: string,
}