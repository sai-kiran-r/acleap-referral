import React from "react";
import { faBook, faFeather, faPen, faStar, faPersonBooth } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getPatient } from "../../services/fhirServices";
import { Main, NormalButton } from "./Home.styles";
import { Card, Container, Divider, Grid, Typography } from "@mui/material";
import { transformPatient } from "../../services/fhirUtil";
import ServiceRequested from "../../components/ServiceRequested";
import PatientAlert from "../../components/PatientAlert";
import PatientQueue from "../../components/PatientQueue";
import { blue, red } from "@mui/material/colors";
import { ACLPatient } from "../../types";

const Home = () => {
    const [patient, setPatient] = React.useState<ACLPatient | 'loading' | 'error'>('loading')

    React.useEffect(() => {
        getPatient().then((res) => {
            const transformedPatient = transformPatient(res)
            setPatient(transformedPatient)
        }).catch((_) => {
            setPatient('error')
        })
    }, [])

    return (
        <Main>
            <Container sx={{ paddingTop: '24px', paddingBottom: '24px' }}>
                <Card variant="outlined" sx={{ padding: '16px', marginBottom: '24px' }}>
                    <Typography variant="h6" mb={2}>Referral ID: X1AE78A</Typography>
                    <Grid container spacing={2}>
                        <Grid item sm={12} md={4}>
                            <Card variant="outlined" sx={{ height: '100%', padding: '16px' }}>
                                {
                                    patient === 'loading' ? (
                                        <Typography variant="subtitle1" color={blue}>Loading patient data...</Typography>
                                    ) :
                                        patient === 'error' ? (
                                            <Typography variant="subtitle1" color={red}>Unable to load patient data. Please login.</Typography>
                                        ) : (
                                            <>
                                                <Typography variant="body1" my={1}>First name: <b>{patient.firstName}</b></Typography>
                                                <Typography variant="body1" my={1}>Last name: <b>{patient.lastName}</b></Typography>
                                                <Typography variant="body1" my={1}>Birth date: <b>{patient.birthDate}</b></Typography>
                                                <Typography variant="body1" my={1}>Ethnicity: <b>{patient.ethnicity}</b></Typography>
                                                <Typography variant="body1" my={1}>Phone: <b>{patient.phone}</b></Typography>
                                                <Typography variant="body1" my={1}>E-mail: <b>{patient.email}</b></Typography>
                                                <Typography variant="body1" my={1}>Gender: <b>{patient.gender}</b></Typography>
                                            </>
                                        )}

                            </Card>
                        </Grid>
                        <Grid item sm={12} md={8} overflow={'auto'}>
                            <ServiceRequested />
                        </Grid>
                    </Grid>
                    <Divider sx={{ marginTop: '24px', marginBottom: '16px' }} />
                    <Grid container>
                        <Grid item sm={12} md={12} overflow={'auto'}>
                            <PatientAlert />
                        </Grid>
                    </Grid>
                </Card>
                <Card variant="outlined" sx={{ padding: '16px', marginBottom: '24px' }}>
                    <Grid container spacing={2}>
                        <Grid item sm={12} md={12} overflow={'auto'}>
                            <PatientQueue />
                        </Grid>
                    </Grid>
                </Card>
                <Card variant="outlined" sx={{ padding: '16px' }}>
                    <Typography variant="h6" mb={2}>Patient activities: </Typography>
                    <Grid container spacing={1}>
                        <Grid item xs={6} sm={4}>
                            <NormalButton startIcon={<FontAwesomeIcon icon={faBook} />} fullWidth variant="contained" color="primary">Activity log</NormalButton>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                            <NormalButton startIcon={<FontAwesomeIcon icon={faFeather} />} fullWidth variant="contained" color="info">Encounters</NormalButton>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                            <NormalButton startIcon={<FontAwesomeIcon icon={faPen} />} fullWidth variant="contained" color="secondary">Planned encounters</NormalButton>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                            <NormalButton startIcon={<FontAwesomeIcon icon={faStar} />} fullWidth variant="contained" color="success">View all tasks</NormalButton>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                            <NormalButton startIcon={<FontAwesomeIcon icon={faPersonBooth} />} fullWidth variant="contained" color="warning">New referral</NormalButton>
                        </Grid>
                    </Grid>
                </Card>
            </Container>
        </Main>
    )
}

export default Home

