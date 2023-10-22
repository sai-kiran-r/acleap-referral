import FHIR from 'fhirclient';
import { Patient, ServiceRequest } from 'fhir/r4'

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

    return { patient, serviceRequests };
};