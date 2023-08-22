import FHIR from 'fhirclient';
import { Patient } from 'fhir/r4'

export const getPatient = async (): Promise<Patient> => {
    const client = await FHIR.oauth2.ready();
    const patient = await client.patient.read();
    return patient;
}