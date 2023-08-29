import { Card, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React from "react";
import { ReferralStatus } from "../../utils/constants";
import { ACLPatientQueue } from "../../types";

function createData(
    dateServed: string,
    referralId: string,
    summary: string,
    status: ReferralStatus,
    referralType: string,
    firstName: string,
    lastName: string,
) {
    return { dateServed, referralId, summary, status, referralType, firstName, lastName } as ACLPatientQueue;
}

const rows = [
    createData('01/15/2023', 'xabcqwe121', 'Further action on housing', ReferralStatus.PLANNED, 'Housing', 'Syd', 'Barrett'),
    createData('03/03/2023', 'xabcqwe122', 'Further action on employment', ReferralStatus.IN_PROGRESS, 'Housing', 'Roger', 'Waters'),
    createData('01/15/2023', 'xabcqwe123', 'Further action on legal service', ReferralStatus.SCHEDULED, 'Housing', 'Rick', 'Wright'),
];

const getStatusUi = (status: ReferralStatus) => {
    switch (status) {
        case 'planned':
            return <Chip color="primary" label={status} />
        case 'in-progress':
            return <Chip color="warning" label={status} />
        case 'scheduled':
            return <Chip color="info" label={status} />
        case 'complete':
            return <Chip color="success" label={status} />
        default:
            return <Chip color="primary" label={status} />
    }
}

const PatientQueue = () => {

    return (
        <>
            <Typography variant="h6" mb={2}>Patient queue</Typography>
            <TableContainer component={({ children, ...props }) => <Card {...props} variant="outlined">{children}</Card>}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell><b>Date served</b></TableCell>
                            <TableCell><b>Referral Id</b></TableCell>
                            <TableCell><b>Summary</b></TableCell>
                            <TableCell><b>Status</b></TableCell>
                            <TableCell align="right"><b>Referral type</b></TableCell>
                            <TableCell align="right"><b>First name</b></TableCell>
                            <TableCell align="right"><b>Last name</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.referralId}
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    cursor: 'pointer',
                                    ':hover': {
                                        backgroundColor: '#f5f5f5',
                                    }
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.dateServed}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <i>{row.referralId}</i>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {row.summary}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {getStatusUi(row.status)}
                                </TableCell>
                                <TableCell align="right">{row.referralType}</TableCell>
                                <TableCell align="right">{row.firstName}</TableCell>
                                <TableCell align="right">{row.lastName}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default PatientQueue;
