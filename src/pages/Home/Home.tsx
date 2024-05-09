import React, { useState } from "react";
import { Main } from "./Home.styles";
import { Card, Container, Grid, Tab, Tabs } from "@mui/material";
import NewReferrals from "../../components/NewReferrals";
import ActiveReferrals from "../../components/ActiveReferrals";
import ArchiveReferrals from "../../components/ArchiveReferrals";
import PatientSearch from "../../components/PatientSearch";

const Home = () => {

    const [value, setValue] = useState<number>(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Main>
<Container sx={{ height: '100vh', paddingTop: '24px', paddingBottom: '24px' }}>
                <Tabs value={value} onChange={handleChange}>
                    <Tab label="MANAGE REFERRALS" />
                    <Tab label="CREATE REFERRALS" />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <Card variant="outlined" sx={{ padding: '16px', marginBottom: '24px' }}>
                        <Grid container spacing={2}>
                            <Grid item sm={12} md={12} overflow={'auto'}>
                                <NewReferrals />
                            </Grid>
                        </Grid>
                    </Card>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Card variant="outlined" sx={{ padding: '16px', marginBottom: '24px' }}>
                        <Grid container spacing={2}>
                            <Grid item sm={12} md={12} overflow={'auto'}>
                                <PatientSearch />
                            </Grid>
                        </Grid>
                    </Card>
                </TabPanel>
            </Container>
        </Main>
    )
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
        >
            {value === index && (
                <Container sx={{ paddingTop: '24px' }}>
                    {children}
                </Container>
            )}
        </div>
    );
}

export default Home