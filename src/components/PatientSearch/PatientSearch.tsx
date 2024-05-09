import {Button, TextField, Typography } from "@mui/material";
import React from "react";

const PatientSearch = () => {

    const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
    const [dialogOpen, setDialogOpen] = React.useState(false)

    React.useState(() => {
        getPatientSearch();
    })

    const getPatientSearch = async() => {
        let response: any = await fetch("");
        console.log("Response", response);
    }

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    };

    const newPatient = () => {
        setDialogOpen(true);
    }

    // Need to implement the footer part and sorting part
    return (
        <>
        {/* {dialogOpen ? null : null} */}
            <Typography variant="h6" mb={2}>Patient Search</Typography>
            <br></br>
            <TextField
                label="Last Name"
                variant="outlined"
                size='small'
                name='lastName'
            >Last Name</TextField>
            <TextField
                type="date"
                variant="outlined"
                size='small'
                name='dateOfBirth'
            >Last Name</TextField>
            <Button
            variant="contained"
            >
                SEARCH
            </Button>
            <Button
            variant="contained"
            onClick={newPatient}
            >
            CREATE NEW PATIENT
            </Button>
        </>
    );
}

export default PatientSearch;
