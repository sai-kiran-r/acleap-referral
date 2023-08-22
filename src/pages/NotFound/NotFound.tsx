import { Container, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import React from "react";

const NotFound = () => {
    return (
        <Container>
            <Typography variant="h1" color={red[400]}>Page not found</Typography>
        </Container>
    )
}

export default NotFound