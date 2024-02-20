// Import axios for making HTTP requests
import axios from 'axios';
import { Patient, PractitionerRole, ServiceRequest, Task } from 'fhir/r4';


// Define a TypeScript type for the function response
type PingServerResponse = {
  success: boolean;
  message?: any;
  data?:any
};

interface UpdateTaskRequest {
  taskId: string;
  newStatus: string;
  newOwnerReference: string;
  newNoteText: string;
}

const URL = `https://acleapbackendservice.azurewebsites.net`
// const URL = `http://localhost:3000`

const getData=async(url:string)  =>{
  try {
  // Use axios to perform a GET request
  const response : any = await axios.get(url);
  // If the request was successful, return a success message
  return response.data
} catch (error) {
  // Handle errors, including errors thrown by axios and network issues
  if (axios.isAxiosError(error)) {
    // Axios error
    return {
      success: false,
      message: `Error pinging server: ${error}`,
    };
  } else {
    // Non-axios error (e.g., network error)
    return {
      success: false,
      message: "Error pinging server: An unexpected error occurred",
    };
  }
}
}

export const updateData=async(taskById:string,payload:any)  =>{
  try {
  // Use axios to perform a GET request
  const response : any = await axios.post(`${URL}/update/Task/${taskById}`,payload);
  // If the request was successful, return a success message
  return response.data
} catch (error) {
  // Handle errors, including errors thrown by axios and network issues
  if (axios.isAxiosError(error)) {
    // Axios error
    return {
      success: false,
      message: `Error pinging server: ${error}`,
    };
  } else {
    // Non-axios error (e.g., network error)
    return {
      success: false,
      message: "Error pinging server: An unexpected error occurred",
    };
  }
}
}

// // Function to call the backend endpoint
// const updateTask = async (data: UpdateTaskRequest) => {
//   try {
//     const response = await axios.post('http://localhost:3000/updateTask', data);
//     console.log(response.data.message);
//     // Handle success (e.g., show a success message)
//   } catch (error) {
//     console.error("Error updating task:", error.response?.data?.error || error.message);
//     // Handle error (e.g., show an error message)
//   }
// };



// Create an async function to ping the server
const pingServer = async () => {
  const serverURLTask: string = `${URL}/Task`; // Replace with your server URL
  const serverURLServ: string = `${URL}/ServiceRequest`; // Replace with your server URL
  const serverURLPatient: string = `${URL}/Patient`; // Replace with your server URL
  const serverURLRole: string = `${URL}/PractitionerRole`; // Replace with your server URL

  const tasks : Task[] = await getData(serverURLTask) as  Task[];
  console.log("Tasks from Server: ",tasks);
  const patient : Patient = await getData(serverURLPatient) as Patient;
  const serviceRequests : ServiceRequest[] = await getData(serverURLServ) as ServiceRequest[]
  const practitionerRole : PractitionerRole[] = await getData(serverURLRole)
  // const practitionerRole = await getData(serverURLRole)
  // const practitionerRole = await getData(serverURLTask)


  return { patient , serviceRequests, tasks,  practitionerRole};
};

export default pingServer;
