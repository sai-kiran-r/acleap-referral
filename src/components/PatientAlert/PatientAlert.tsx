import { Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React from "react";

function createData(
    date: string,
    summary: string,
    referralType: string,
    firstName: string,
    lastName: string,
) {
    return { date, summary, referralType, firstName, lastName };
}

const rows = [
    createData('08/03/2023', 'https://new-referral.url', 'Housing', 'Robin', 'Holland'),
];

const PatientAlert = () => {
    return (
        <>
            <Typography variant="h6" mb={2}>Patient alert</Typography>
            <TableContainer component={({ children, ...props }) => <Card {...props} variant="outlined">{children}</Card>}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell><b>Date</b></TableCell>
                            <TableCell><b>Summary</b></TableCell>
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
                                selected={false}
                            >
                                <TableCell component="th" scope="row">
                                    {row.date}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <a href={row.summary} target="_blank" rel="noopener noreferrer">{row.summary}</a>
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

export default PatientAlert;
