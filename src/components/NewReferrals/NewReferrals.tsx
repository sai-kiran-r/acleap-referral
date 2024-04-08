import { Card, Typography } from "@mui/material";
import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { ACLPatient, ACLServiceRequest, ACLTasks, ACLPractitionerRole } from "../../types";
import ReferralStatusDialog from "../ReferralStatusDialog";
import { transformPatient ,transformServiceRequests, transformTasks, transformPractitionerRole } from "../../services/fhirUtil";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import pingServer from  "../../services/azureFhirResource"

interface EnrichedServiceRequest extends ACLServiceRequest {
    firstName: string;
    lastName: string;
    taskAuthoredDate: string;
    taskBusinessStatus: string;
}

const colorChips:any = {
    "Received" : 'info',
    "Assigned" : 'success',
    "In progress" : 'primary',
    "Entered in HMIS" : 'secondary',
    "Rejected" : "error",
    "Contact unsuccessful" : "warning",
    // "Service not Needed" : "tertiary",
    "On Hold" : "error",
    "Entered in error" : "error"
}

const columns: GridColDef[] = [
    { field: 'taskAuthoredDate', headerName: 'Date Requested', width: 140 },
    { field: 'lastName', headerName: 'Last name', width: 120 },
    { field: 'firstName', headerName: 'First Name', width: 120 },
    { field: 'serviceRequested', headerName: 'Service Requested', width: 250 },
    { field: 'referralSource', headerName: 'Referral Source', width: 180 },
    { field: 'taskBusinessStatus',headerName: 'Task Status',renderCell:renderRating, width:140 },
    { field: 'taskOwner', headerName: 'Task Owner', width: 140 }
  ];

function renderRating(params: any) {
    return <Chip label={params.value} color={colorChips[params.value]}/>;
}

const NewReferrals = () => {

    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [patients, setPatients] = React.useState<ACLPatient>([])
    const [services, setServices] = React.useState([])
    const [tasks, setTasks] = React.useState<ACLTasks>([])
    const [practitionerRole, setPractitionerRole] = React.useState<ACLPractitionerRole | undefined>([])
    const [selectedPractitionerRole, setSelectedPractitionerRole] = React.useState<ACLPractitionerRole | undefined>([])
    const [selectedPatient, setSelectedPatient] = React.useState<ACLPatient  | undefined>({})
    const [selectedService, setSelectedService] = React.useState<ACLServiceRequest  | undefined>({})
    const [selectedTask, setSelectedTask] = React.useState<ACLTasks  | undefined>({})

      React.useEffect(() => {
        getData();
    }, [])

    const  getData = async()=>{
        const resources : any = await pingServer();
        const PatientData  = resources.patient.map((patient: any) => patient.resource);
        const ServiceRequestData = resources.serviceRequests.map((serviceRequests: any) => serviceRequests.resource);
        const tasksData = resources.tasks.map((tasks: { resource: any; }) => tasks.resource);
        const practitionerRoleData = resources.practitionerRole.map((practitionerRole: { resource: any; }) => practitionerRole.resource);

        const patient = PatientData.slice(1);
        const serviceRequests = ServiceRequestData.slice(1);
        const tasks = tasksData.slice(1);
        const practitionerRole = practitionerRoleData.slice(1);

        const transformedPatient : ACLPatient = transformPatient(patient);
        const transformedServices : ACLServiceRequest = transformServiceRequests(serviceRequests);
        const transformedTasks : ACLTasks = transformTasks(tasks);
        const transformedPractitionerRole: ACLPractitionerRole = transformPractitionerRole(practitionerRole);

        setPatients(transformedPatient);
        setTasks(transformedTasks);
        setPractitionerRole(transformedPractitionerRole);

        const data = transformedServices.map((item: ACLServiceRequest): EnrichedServiceRequest | null => {
            // Attempt to find a matching patient and task
            const matchingPatient = transformedPatient.find((p: ACLPatient) => p.patientFhirId === item.serviceRequestPatientId);
            const matchingTask = transformedTasks.find((x: ACLTasks) => x.taskServiceRequestId === item.serviceRequestFHIRId);

            // Only proceed if both a matching patient and task are found and their data is complete
            if (matchingPatient && matchingTask &&
                typeof matchingPatient.firstName === 'string' && typeof matchingPatient.lastName === 'string' &&
                typeof matchingTask.taskAuthoredDate === 'string' && typeof matchingTask.taskBusinessStatus === 'string') {
                    let matchedTaskOwner: string;
                    if(matchingTask.taskOwner === "Dr. Onwers"){
                        matchedTaskOwner = "UnAssigned"
                    }
                    else{
                        matchedTaskOwner = matchingTask.taskOwner
                    }
                return {
                    ...item,
                    referralSource: matchingTask.taskRequester,
                    firstName: matchingPatient.firstName,
                    lastName: matchingPatient.lastName,
                    taskAuthoredDate: matchingTask.taskAuthoredDate,
                    taskBusinessStatus: matchingTask.taskBusinessStatus,
                    taskOwner: matchedTaskOwner
                };
            }

            // Return null for unmatched or incomplete data to filter out later
            return null;
        }).filter((item : EnrichedServiceRequest | null): item is EnrichedServiceRequest => item !== null); // Remove any service requests that didn't match or were incomplete

            // Sort the data to show "Received" tasks on the top
        data.sort((a: { taskBusinessStatus: string; }, b: { taskBusinessStatus: string; }) => {
            if (a.taskBusinessStatus === "Received") return -1;
            if (b.taskBusinessStatus === "Received") return 1;
            return 0;
        });

        setServices(data)
    }

    const handleRowClick = (row:{row: ACLPatient}) => {
        const selectedRow = row.row;
        const selected = patients.find((p: ACLPatient) => p.patientFhirId === selectedRow.serviceRequestPatientId);
        const selectedTask = tasks.find((x: ACLTasks) => x.taskServiceRequestId === selectedRow.serviceRequestFHIRId);
        const selectedPractitionerRole = practitionerRole;
        setSelectedPatient(selected);
        setSelectedService(selectedRow);
        setSelectedTask(selectedTask);
        setSelectedPractitionerRole(selectedPractitionerRole);
        setDialogOpen(true)
    }

    const handleClose = () => {
        setDialogOpen(false)
        setSelectedPatient(undefined)
    }

    return (
        <>
            {dialogOpen ? <ReferralStatusDialog open={true} onClose={handleClose}
            patient={selectedPatient} service={selectedService} tasks={selectedTask} practitionerRole={selectedPractitionerRole}
            getData={getData} />:null}
            <Typography variant="h6" mb={2}>Referral Management Dashboard</Typography>
            <div style={{  width: '100%' }}>
            {services?.length === 0 ? <TableContainer component={({ children, ...props }) => <Card {...props} variant="outlined">{children}</Card>}>
                <Table sx={{ minWidth: 700 }} aria-label="simple table">
                    <TableBody>
                    <TableRow>
                        <TableCell colSpan={12}><div className="container ">
                            <div className="row">
                                <div className="col-12">
                                    <div className="d-flex justify-content-center align-items-center">No New Referrals</div>
                                </div>
                            </div>
                        </div>
                        </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            :<DataGrid
                rows={services}
                onRowClick={(e:any) => {
                  handleRowClick(e)
              }}
                columns={columns}
                getRowId={(row) => row.id}
                initialState={{
                pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                },
                }}
                pageSizeOptions={[5, 10]}
            />}
            </div>
        </>
    )

}

export default NewReferrals