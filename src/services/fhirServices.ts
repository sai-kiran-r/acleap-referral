import FHIR from 'fhirclient';
import { Patient, ServiceRequest } from 'fhir/r4'

export const getPatient = async (): Promise<Patient> => {
    const client = await FHIR.oauth2.ready();
    const patient = await client.patient.read();
    console.log("Patient",patient)
    return patient;
}

export const getPatientAndServiceRequests = async (): Promise<{ patient: Patient, serviceRequests: ServiceRequest[] }> => {
    const client = await FHIR.oauth2.ready();

    // Fetch patient data
    const patient = await client.patient.read();

    // Fetch Service Request data for the patient
    let serviceRequests: ServiceRequest[] = [];
    try {
        const results = await client.request(`ServiceRequest?subject=${patient.id}`, { pageLimit: 0, flat: true }) as ServiceRequest[];
        serviceRequests = results;
    } catch (error) {
        console.error("Error fetching Service Requests: ", error);
    }

    console.log("patient",patient)
    console.log("serviceRequest",serviceRequests)
    // console.log("serviceRequest",serviceRequests)
    return { patient, serviceRequests };
};