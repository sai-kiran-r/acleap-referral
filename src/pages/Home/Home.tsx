import React from "react";
import { Main } from "./Home.styles";
import { Card, Container,Grid} from "@mui/material";
import NewReferrals from "../../components/NewReferrals";
import ActiveReferrals from "../../components/ActiveReferrals";
import ArchiveReferrals from "../../components/ArchiveReferrals";

const Home = () => {

    return (
        <Main>
            <Container sx={{ height:'100vh',paddingTop: '24px', paddingBottom: '24px' }}>
                <Card variant="outlined" sx={{ padding: '16px', marginBottom: '24px' }}>
                    <Grid container spacing={2}>
                        <Grid item sm={12} md={12} overflow={'auto'}>
                            <NewReferrals />
                        </Grid>
                    </Grid>
                </Card>
                {/* <Card variant="outlined" sx={{ padding: '16px', marginBottom: '24px'  }}>
                    <Grid container spacing={2}>
                    <Grid item sm={12} md={12} overflow={'auto'}>
                        <ActiveReferrals />
                        </Grid>
                    </Grid>
                </Card>
                <Card variant="outlined" sx={{ padding: '16px', marginBottom: '24px'  }}>
                    <Grid container spacing={2}>
                    <Grid item sm={12} md={12} overflow={'auto'}>
                        <ArchiveReferrals />
                        </Grid>
                    </Grid>
                </Card> */}
            </Container>
        </Main>
    )
}

export default Home