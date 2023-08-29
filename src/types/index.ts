import { ReferralStatus } from "../utils/constants";

export type ACLPatient = {
    id?: string;
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

export type ACLPatientAlert = {
    date?: string,
    summary?: string,
    status?: ReferralStatus,
    referralType?: string,
    firstName?: string,
    lastName?: string,
}