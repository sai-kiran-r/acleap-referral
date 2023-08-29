import { Card, Table, Chip, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React from "react";
import ReferralStatusDialog from "../ReferralStatusDialog";
import { ACLPatientAlert } from "../../types";
import { ReferralStatus } from "../../utils/constants";

function createData(
    date: string,
    summary: string,
    status: ReferralStatus,
    referralType: string,
    firstName: string,
    lastName: string,
) {
    return { date, summary, status, referralType, firstName, lastName };
}

const rows = [
    createData('08/03/2023', 'https://new-referral.url', ReferralStatus.PLANNED, 'Housing', 'Robin', 'Holland'),
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

const PatientAlert = () => {
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [selectedPatient, setSelectedPatient] = React.useState<ACLPatientAlert  | undefined>(undefined)

    const handleRowClick = (row: ACLPatientAlert) => {
        setSelectedPatient(row)
        setDialogOpen(true)
    }

    const handleClose = () => {
        setDialogOpen(false)
        setSelectedPatient(undefined)
    }
    return (
        <>
            <ReferralStatusDialog open={dialogOpen} onClose={handleClose} patient={selectedPatient} />
            <Typography variant="h6" mb={2}>Patient alert</Typography>
            <TableContainer component={({ children, ...props }) => <Card {...props} variant="outlined">{children}</Card>}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell><b>Date</b></TableCell>
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
                                key={row.summary}
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    cursor: 'pointer',
                                    ':hover': {
                                        backgroundColor: '#f5f5f5',
                                    }
                                }}
                                onClick={(e) => {
                                    e.preventDefault()
                                    handleRowClick(row)
                                }}
                                // selected={false}
                            >
                                <TableCell component="th" scope="row">
                                    {row.date}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <a href={row.summary} target="_blank" rel="noopener noreferrer">{row.summary}</a>
                                </TableCell>
                                <TableCell>{getStatusUi(row.status)}</TableCell>
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

export default PatientAlert;
