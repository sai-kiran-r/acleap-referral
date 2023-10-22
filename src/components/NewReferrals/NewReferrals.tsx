import { Card, Typography } from "@mui/material";
import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { ACLPatient } from "../../types";
import ReferralStatusDialog from "../ReferralStatusDialog";
import { transformPatient ,transformServiceRequests} from "../../services/fhirUtil";
import { getPatientAndServiceRequests} from "../../services/fhirServices";
import { DataGrid, GridColDef } from '@mui/x-data-grid';


const columns: GridColDef[] = [
  { field: 'dateCreated', headerName: 'Date Created', width:240 },
  { field: 'lastName', headerName: 'Last name', width:190  },
  {field: 'firstName',headerName: 'First Name', width:160},
  { field: 'serviceRequested', headerName: 'Service Requested', width:280},
  {field: 'referralSource',headerName: 'Referral Source', width:200},
];


const NewReferrals = () => {

    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [selectedPatient, setSelectedPatient] = React.useState<ACLPatient  | undefined>({})
    const [services, setServices] = React.useState([])

      React.useEffect(() => {
        (async () => {
            const { patient ,serviceRequests} = await getPatientAndServiceRequests();

            const transformedPatient:any = transformPatient(patient);
            const transformedServices = transformServiceRequests(serviceRequests);

            const data = transformedServices.map((items:any)=>{
                return{
                    ...items,
                    firstName:transformedPatient.firstName,
                    lastName:transformedPatient.lastName,
                }
            })

            setServices(data)
        })();
    }, [])

    const handleRowClick = (row:{row: ACLPatient}) => {
        setSelectedPatient(row.row)
        setDialogOpen(true)
    }

    const handleClose = () => {
        setDialogOpen(false)
        setSelectedPatient(undefined)
    }

    return (
        <>
            <ReferralStatusDialog open={dialogOpen} onClose={handleClose} patient={selectedPatient} />
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