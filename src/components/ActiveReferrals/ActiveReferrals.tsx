import { Card, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import React from "react";
import { DataGrid, GridColDef } from '@mui/x-data-grid';


const columns: GridColDef[] = [
    { field: 'dateServed', headerName: 'Date served', width:240 },
    { field: 'lastName', headerName: 'Last name', width:190  },
    {field: 'firstName',headerName: 'First Name', width:160},
    { field: 'status', headerName: 'Status',width:120},
    { field: 'serviceRequested', headerName: 'Service Requested', width:230},
    {field: 'owner',headerName: 'Owner', width:160},
  ];

const rows : any= [];

const ActiveReferrals = () => {

    return (
        <>
            <Typography variant="h6" mb={2}>Active Referrals</Typography>
            <div style={{  width: '100%' }}>
            {rows.length === 0 ? <TableContainer component={({ children, ...props }) => <Card {...props} variant="outlined">{children}</Card>}>
                <Table sx={{ minWidth: 700 }} aria-label="simple table">
                    <TableBody>
                    <TableRow>
                        <TableCell colSpan={12}><div className="container ">
                            <div className="row">
                                <div className="col-12">
                                    <div className="d-flex justify-content-center align-items-center">No Active Referrals</div>
                                </div>
                            </div>
                        </div>
                        </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            :<DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                },
                }}
                pageSizeOptions={[5, 10]}
            />}
            </div>
        </>
    );
}

export default ActiveReferrals;
