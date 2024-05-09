import { Button, TextField, Typography, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from 'axios';

const PatientSearch = () => {
    const URL = process.env.REACT_APP_BACKEND_API_URL;
    const [lastName, setLastName] = useState("");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [patients, setPatients] = useState<any[]>([]); // State to store fetched patients

    useEffect(() => {
        // Initial fetch can be done here if needed
    }, []);

    const getPatientSearch = async (lastName: string, dateOfBirth: string) => {
        try {
            // Construct the URL with query parameters
            const queryParams = new URLSearchParams({
                lastName: lastName,
                dob: dateOfBirth
            });
            const apiUrl = `${URL}/search/Patient?${queryParams}`;

            // Send GET request using axios.get
            const response = await axios.get(apiUrl);

            if (response.status === 200) {
                const data = response.data;
                console.log("Response", data);
                setPatients(data); // Update state with fetched patients
            } else {
                console.error("Failed to fetch patient data");
            }
        } catch (error) {
            console.error("Error fetching patient data:", error);
        }
    };

    const handleSearch = () => {
        // Call getPatientSearch with last name and date of birth
        getPatientSearch(lastName, selectedDate?.toISOString().split('T')[0] || '');
    };

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    };

    const newPatient = () => {
        setDialogOpen(true);
    };

    return (
        <>
            <Typography variant="h6" mb={2}>Patient Search</Typography>
            <p>Search for Patient to start a referral</p>
            <TextField
                label="Last Name"
                variant="outlined"
                size="small"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
                label=""
                type="date"
                variant="outlined"
                size="small"
                name="dateOfBirth"
                onChange={(e) => handleDateChange(new Date(e.target.value))}
            />
            <Button variant="contained" onClick={handleSearch}>SEARCH</Button>
            {dialogOpen && (
                /* Include your dialog component here */
                <div>Dialog Content</div>
            )}
        </>
    );
};

export default PatientSearch;
