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
import {  getResources } from "../../services/fhirServices";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import axios from 'axios';


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
  { field: 'taskAuthoredDate', headerName: 'Date Requested', width:200 },
  { field: 'lastName', headerName: 'Last name', width:140 },
  { field: 'firstName',headerName: 'First Name', width:140 },
  { field: 'serviceRequested', headerName: 'Service Requested', width:250 },
  { field: 'referralSource',headerName: 'Referral Source', width:200 },
  { field: 'taskBusinessStatus',headerName: 'Task Status',renderCell:renderRating, width:180 },
];

function renderRating(params: any) {
    return <Chip label={params.value} color={colorChips[params.value]}/>
    ;
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

    async function getAzureADToken(): Promise<string> {
        // Retrieve configuration from environment variables
        const tenantId: string | undefined = process.env.tenant_Id;
        const clientId: string | undefined = process.env.clientId;
        const clientSecret: string | undefined = process.env.clientSecret;
        const scope: string | undefined = process.env.scope;

        console.log("clientId", clientId);
        console.log("clientSecret", clientSecret);
        console.log("scope", scope);

        if (!clientId || !clientSecret || !scope) {
            throw new Error('Missing configuration values');
        }

        // Token URL constructed with the tenant ID
        const tokenUrl: string | undefined = process.env.tokenUrl;
        console.log("tokenUrl", tokenUrl);

        if (!tokenUrl) {
            throw new Error('Missing token URL');
        }

        // Set up the POST request body for the token request
        const tokenRequestData = new URLSearchParams();
        console.log("tokenRequestData", tokenRequestData);
        tokenRequestData.append('client_id', clientId);
        tokenRequestData.append('scope', scope);
        tokenRequestData.append('client_secret', clientSecret);
        tokenRequestData.append('grant_type', 'client_credentials');
        console.log("tokenRequestData", tokenRequestData.toString());

        try {
            // Make the HTTP request to get the access token
            const tokenResponse = await axios.post(tokenUrl, tokenRequestData.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            // Return the access token from the response
            console.log("tokenResponse.data.access_token", tokenResponse.data.access_token)
            return tokenResponse.data.access_token;
        } catch (error) {
            console.error('Error obtaining token from Azure AD:', error);
            throw new Error('Failed to obtain access token');
        }
    }
    
    const  getData = async()=>{
        const accessToken = await getAzureADToken();
        console.log('AccessToken', accessToken);
        console.log("This is inside getData()")

        const { patient, serviceRequests, tasks, practitionerRole } = await getResources();

            const transformedPatient : ACLPatient = transformPatient(patient);
            const transformedServices : ACLServiceRequest = transformServiceRequests(serviceRequests);
            const transformedTasks : ACLTasks = transformTasks(tasks);
            const transformedPractitionerRole: ACLPractitionerRole = transformPractitionerRole(practitionerRole);

            setPatients(transformedPatient);
            setTasks(transformedTasks);
            setPractitionerRole(transformedPractitionerRole);

            const data = transformedServices.map((item : ACLServiceRequest) => {
                const matchingPatient = transformedPatient.find((p: ACLPatient) => p.patientFhirId === item.serviceRequestFhirId);
                const matchingTask = transformedTasks.find((x: ACLTasks) => x.taskId === item.serviceRequestId);
                const {firstName,lastName}=matchingPatient;
                const {taskAuthoredDate, taskBusinessStatus} = matchingTask;
                if (matchingPatient && matchingTask) {
                   return  { ...item, firstName,lastName, taskAuthoredDate, taskBusinessStatus };
                }

                return{}
            });

            setServices(data)
    }

    const handleRowClick = (row:{row: ACLPatient}) => {
        const selectedRow = row.row;
        const selected = patients.find((p: ACLPatient) => p.patientFhirId === selectedRow.serviceRequestFhirId);
        const selectedTask = tasks.find((x: ACLTasks) => x.taskId === selectedRow.serviceRequestId);
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
            <Typography variant="h6" mb={2}>Referral Managment Dashborad</Typography>
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