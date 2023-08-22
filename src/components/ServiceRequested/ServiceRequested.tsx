import { Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import React from "react";

function createData(
    serviceRequest: string,
    verificationMethod: string,
    storageLocation: string,
) {
    return { serviceRequest, verificationMethod, storageLocation };
}

const rows = [
    createData('Driver licence', 'Scanned', 'Electronic file'),
    createData('Food stamp or TANF Award Letter or Application', 'Scanned', 'Electronic file'),
];

const ServiceRequested = () => {
    return (
        <TableContainer component={({ children, ...props }) => <Card {...props} variant="outlined">{children}</Card>}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell><b>Service requested</b></TableCell>
                        <TableCell align="right"><b>Verification method</b></TableCell>
                        <TableCell align="right"><b>Storage location</b></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.serviceRequest}
                            sx={{
                                '&:last-child td, &:last-child th': { border: 0 },
                                cursor: 'pointer',
                                ':hover': {
                                    backgroundColor: '#f5f5f5',
                                }
                            }}
                            selected={false}
                        >
                            <TableCell component="th" scope="row">
                                {row.serviceRequest}
                            </TableCell>
                            <TableCell align="right">{row.verificationMethod}</TableCell>
                            <TableCell align="right">{row.storageLocation}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default ServiceRequested;
