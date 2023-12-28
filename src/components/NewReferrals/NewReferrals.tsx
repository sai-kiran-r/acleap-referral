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

const columns: GridColDef[] = [
  { field: 'taskAuthoredDate', headerName: 'Date Requested', width:240 },
  { field: 'lastName', headerName: 'Last name', width:190  },
  {field: 'firstName',headerName: 'First Name', width:160},
  { field: 'serviceRequested', headerName: 'Service Requested', width:280},
  {field: 'referralSource',headerName: 'Referral Source', width:200},
];


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
                const {taskAuthoredDate} = matchingTask;
                if (matchingPatient && matchingTask) {
                   return  { ...item, firstName,lastName, taskAuthoredDate };
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
            <Typography variant="h6" mb={2}>New Referrals</Typography>
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