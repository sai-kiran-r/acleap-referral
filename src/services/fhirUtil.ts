import { Patient, ServiceRequest } from "fhir/r4";
import { ACLPatient, ACLServiceRequest } from "../types";
import moment from 'moment';

export const transformPatient = (patient: Patient): ACLPatient => {
    const raceExtension = patient.extension?.find(ext => ext.url.includes('StructureDefinition/us-core-race'));
    const race = raceExtension ? raceExtension?.extension?.find(ext => ext.url === "text")?.valueString : undefined;

    const sexAtBirthExtension = patient.extension?.find(ext => ext.url.includes('StructureDefinition/us-core-birthsex'));
    const sexAtBirth = sexAtBirthExtension ? sexAtBirthExtension.valueCode : undefined;

    const genderIdentityExtension = patient.extension?.find(ext => ext.url.includes('StructureDefinition/athena-patient-extension-genderIdentity'));
    const genderIdentity = genderIdentityExtension ? genderIdentityExtension?.valueCodeableConcept?.text: undefined;

    const sexualOrientationExtension = patient.extension?.find(ext => ext.url.includes('StructureDefinition/athena-patient-extension-sexualOrientation'));
    const sexualOrientation = sexualOrientationExtension ? sexualOrientationExtension?.valueCodeableConcept?.text: undefined;

    const id = patient.identifier?.find(id => id?.system?.includes('NamingSystem/identifier'))?.value;
    const fhirid = patient.id;

    const gender = patient.gender ? patient.gender?.charAt(0).toUpperCase() + patient.gender.slice(1) : undefined;

    const dob = patient.birthDate ? new Date(patient.birthDate) : undefined;
    const ageDiffMs = dob ? Date.now() - dob.getTime() : undefined;
    const ageDate = ageDiffMs ? new Date(ageDiffMs) : undefined;
    const age = ageDate ? Math.abs(ageDate.getUTCFullYear() - 1970).toString() : undefined;

    const ethnicityExtension = patient.extension?.find(ext => ext.url === "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity");
    const ethnicity = ethnicityExtension ? ethnicityExtension.extension?.find(ext => ext.url === "text")?.valueString : undefined;

    const name = patient.name?.[0]?.text;
    const firstName = patient.name?.[0]?.given?.[0];
    const lastName = patient.name?.[0]?.family;

    return {
        id,
        fhirId: fhirid,
        fullName: name,
        firstName,
        lastName,
        birthDate: dob?.toLocaleDateString(),
        gender,
        age: parseInt(age ?? '0'),
        ethnicity,
        phone: patient.telecom?.find(telecom => telecom.system === "phone")?.value,
        email: patient.telecom?.find(telecom => telecom.system === "email")?.value,
        address: patient.address?.[0]?.line?.[0],
        race,
        sexAtBirth,
        genderIdentity,
        sexualOrientation,
    }
}


export const transformServiceRequests = (serviceRequests: ACLServiceRequest) => {
    return serviceRequests.map((serviceRequest: ServiceRequest ,index:number) => {

      const dateCreated = moment(serviceRequest.meta?.lastUpdated).format('MM/DD/YYYY');
      const intialReferralNote = serviceRequest.note?.[0]?.text;
      const referralID = serviceRequest.identifier?.[0]?.value;
      const serviceRequested = serviceRequest.code?.text;
      const referralSource = serviceRequest.requester?.display;

      return {
        dateCreated,
        intialReferralNote,
        referralID,
        serviceRequested,
        referralSource,
        id:index
      };
    });
  };