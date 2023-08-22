import { Button, styled } from "@mui/material";

export const Main = styled('main')(({ theme }) => ({
    backgroundColor: theme.palette.grey[100],
}));

export const NormalButton = styled(Button)((_) => ({
    textTransform: 'none',
}))