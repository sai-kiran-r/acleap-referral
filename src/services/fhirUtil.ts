import { Patient, ServiceRequest, Task, PractitionerRole } from "fhir/r4";
import { ACLPatient, ACLServiceRequest, ACLTasks, ACLPractitionerRole} from "../types";
import moment from 'moment';

export const transformPatient = (patient: any): ACLPatient => {
  return patient.map((patient: Patient ,index:number) => {

    const raceExtension = patient.extension?.find(ext => ext.url.includes('StructureDefinition/us-core-race'));
    const race = raceExtension ? raceExtension?.extension?.find(ext => ext.url === "text")?.valueString : undefined;

    const sexAtBirthExtension = patient.extension?.find(ext => ext.url.includes('StructureDefinition/us-core-birthsex'));
    const sexAtBirth = sexAtBirthExtension ? sexAtBirthExtension.valueCode : undefined;

    const genderIdentityExtension = patient.extension?.find(ext => ext.url.includes('StructureDefinition/athena-patient-extension-genderIdentity'));
    const genderIdentity = genderIdentityExtension ? genderIdentityExtension?.valueCodeableConcept?.text: undefined;

    const sexualOrientationExtension = patient.extension?.find(ext => ext.url.includes('StructureDefinition/athena-patient-extension-sexualOrientation'));
    const sexualOrientation = sexualOrientationExtension ? sexualOrientationExtension?.valueCodeableConcept?.text: undefined;

    const id = patient.identifier?.find(id => id?.system?.includes('NamingSystem/identifier'))?.value;
    const patientFhirId = patient.id;

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
        patientFhirId,
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
  });
};


export const transformServiceRequests = (serviceRequests: ACLServiceRequest) => {

    return serviceRequests.map((serviceRequest: ServiceRequest ,index:number) => {

      const dateCreated = moment(serviceRequest.meta?.lastUpdated).format('MM/DD/YYYY');
      const intialReferralNote = serviceRequest.note?.[0]?.text;
      const referralID = serviceRequest.identifier?.[0]?.value;
      const serviceRequested = serviceRequest.code?.text;
      const serviceRequestPatientId = serviceRequest.subject.reference?.replace("Patient/","");
      const serviceRequestFHIRId = serviceRequest?.id;

      return {
        dateCreated,
        intialReferralNote,
        referralID,
        serviceRequested,
        id:index,
        serviceRequestPatientId,
        serviceRequestFHIRId
      };
    });
};

export const transformTasks = (tasks: ACLTasks ) => {

  return tasks.map((task: Task ,index:number) => {

    const taskAuthoredDate = moment(task.authoredOn).format('MM/DD/YYYY');
    const taskDescription = task.code?.coding?.[0]?.display;
    const taskStatus = task.status;
    const taskServiceRequestId = task.focus?.reference?.replace("ServiceRequest/",'') || '';
    const taskPatientId = task.for?.reference?.replace("Patient/",'') || '' ;
    const taskOwner = task.owner?.display;
    const taskBusinessStatus = task.businessStatus?.text;
    const taskRequester = task.requester?.display;
    const taskFHIRId = task?.id;
    const taskNotes = task.note?.map((taskNote: any) => {
      const noteAuthoredDate = moment(taskNote.time).format('MM/DD/YYYY');
      const noteText = taskNote?.text;
      const noteAuthor = taskNote.authorReference?.display;
      return {
        noteAuthoredDate,
        noteText,
        noteAuthor
      };
    });

    return {
      taskFHIRId,
      taskAuthoredDate,
      taskDescription,
      taskStatus,
      taskServiceRequestId,
      taskPatientId,
      taskOwner,
      taskBusinessStatus,
      taskRequester,
      id: index,
      taskNotes
    };
  });
};

export const transformPractitionerRole = (practitionerRole: ACLPractitionerRole ) => {

  return practitionerRole.map((practitionerRole: PractitionerRole) => {
    const practitionerName = practitionerRole.practitioner?.display;
    const practitionerRoleId = practitionerRole?.id;
    const practitionerid = practitionerRole?.practitioner?.reference?.replace("Practitioner/","");
    const practitionerOrganizationName = practitionerRole.organization?.display;

    return{
      practitionerName,
      practitionerRoleId,
      practitionerid,
      practitionerOrganizationName
    }
  });
};