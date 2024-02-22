import { ReferralStatus } from "../utils/constants";

export type ACLPatient = {
    [x:string]: any;
    id?: any;
    patientFhirId?: string;
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

export type ACLServiceRequest = {
    [x:string]: any,
    dateCreated?: string,
    serviceRequested?: string,
    referralID?: string,
    intialReferralNote?: string,
    serviceRequestId?: string,
    serviceRequestPatientId?: string,
    serviceRequestFHIRId?: string
}

export type ACLTasks = {
    [x:string]: any,
    taskDescription?: string,
    taskRequester?: string,
    taskAuthoredDate?: string,
    taskFHIRId?: string,
    taskServiceRequestId?: string,
    taskPatientId?: string,
    taskStatus?: string,
    taskBusinessStatus?: ReferralStatus,
    taskOwner?: string,
    taskNotes?: []
}

export type ACLPractitionerRole = {
    [x:string]: any,
    practitionerName?: string,
    practitionerRoleId?: string,
    practitionerid?: string,
    practitionerOrganizationName?: string,
}