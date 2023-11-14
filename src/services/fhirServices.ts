import FHIR from 'fhirclient';
import { Patient, ServiceRequest , Task, PractitionerRole, Practitioner } from 'fhir/r4'
import { promises } from 'dns';

export const getResources = async (): Promise<{ patient: Patient, serviceRequests: ServiceRequest[], tasks: Task[], practitioner: Practitioner[],practitionerRole : PractitionerRole[]}> => {
    const client = await FHIR.oauth2.ready();

    // Fetch patient data
    const patient = await client.request(`Patient`, { pageLimit: 0, flat: true }) as Patient;

    // Fetch Service Request data for the patient
    let serviceRequests: ServiceRequest[] = [];
    try {
        const results = await client.request(`ServiceRequest`, { pageLimit: 0, flat: true }) as ServiceRequest[];
        serviceRequests = results;
    } catch (error) {
        console.error("Error fetching Service Requests: ", error);
    }

    let tasks: Task[] = [];
    try {
        const results = await client.request(`Task`, { pageLimit: 0, flat: true }) as Task[];
        tasks = results;
    } catch (error) {
        console.error("Error fetching Task resource ", error);
    }

    let practitioner: Practitioner[] = [];
    try {
        const results = await client.request(`PractitionerRole?role=171M00000X`, { pageLimit: 0, flat: true }) as Practitioner[];
        practitioner = results;
    } catch (error) {
        console.error("Error fetching PractitionerRole resource ", error);
    }

    let practitionerRole: PractitionerRole[] = [];
    try {
        const results = await client.request(`PractitionerRole?role=171M00000X`, { pageLimit: 0, flat: true }) as PractitionerRole[];
        practitionerRole = results;
    } catch (error) {
        console.error("Error fetching PractitionerRole resource ", error);
    }

    return { patient, serviceRequests, tasks, practitioner, practitionerRole};
};