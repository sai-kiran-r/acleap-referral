import FHIR from 'fhirclient';
import { Patient, ServiceRequest , Task, PractitionerRole, Practitioner } from 'fhir/r4'
import { fhirclient } from 'fhirclient/lib/types';

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

    console.log("From MELD", JSON.stringify(tasks) + "\n\n");

    return { patient, serviceRequests, tasks, practitioner, practitionerRole};
};

export const getTaskById = async (taskServiceRequestId: string): Promise<Task | null> => {
    const client = await FHIR.oauth2.ready();

    try {
        // Fetch task data using the provided taskServiceRequestId
        const task = await client.request(`Task/${taskServiceRequestId}-task`) as Task;
        console.log("task response",task)
        return task;
    } catch (error) {
        console.error("Error fetching Task: ", error);
        return null;
    }
};

export const updateTask = async (updatedTask: Task): Promise<Task | null> => {
    const client = await FHIR.oauth2.ready();

    try {
        // Ensure the updatedTask object includes the 'id' and 'resourceType'
        if (!updatedTask.id || updatedTask.resourceType !== 'Task') {
            throw new Error('Invalid Task object: Must include id and resourceType.');
        }

        // Perform the update operation
        const result = await client.update(updatedTask as fhirclient.FHIR.Resource) as Task;

        return result;
    } catch (error) {
        console.error("Error updating Task: ", error);
        return null;
    }
};