import React from "react";
import { ACLPatientQueue } from "../../types";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Typography } from "@mui/material";
import { ReferralStatus } from "../../utils/constants";
import { RawDraftContentState } from "draft-js";
import DraftTextInput from "../DraftTextInput";
import { grey } from "@mui/material/colors";

type ReferralStatusDialogProps = {
    open: boolean,
    onClose: () => void,
    patient?: ACLPatientQueue,
}

const ReferralStatusDialog = (props: ReferralStatusDialogProps) => {
    const [status, setStatus] = React.useState<ReferralStatus | undefined>(props.patient?.status)
    const [statusDescription, setStatusDescription] = React.useState<RawDraftContentState | undefined>()
    const [notes, setNotes] = React.useState<RawDraftContentState | undefined>()

    const handleClose = (_: React.SyntheticEvent<unknown>, reason?: string) => {
        if (reason !== 'backdropClick') {
            setStatus(undefined)
            setStatusDescription(undefined)
            setNotes(undefined)
            props.onClose();
        }
    }

    const handleStatusChange = (event: SelectChangeEvent<typeof status>) => {
        setStatus(event.target.value as ReferralStatus);
    };

    return (
        <Dialog disableEscapeKeyDown open={props.open} onClose={handleClose} maxWidth={'md'}>
            <DialogTitle>Referral Id: {props.patient?.referralId}</DialogTitle>
            <DialogContent dividers>
                <Box>
                    <Typography variant="subtitle2" color={grey[800]} m={1}><b>Date served: {new Date().toDateString()}</b></Typography>
                    <Grid container spacing={2}>
                        <Grid item sm={12} md={8}>
                            <Typography variant="subtitle2" color={grey[800]} m={1}>Status description:</Typography>
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <DraftTextInput id={"input-status-description"} value={statusDescription} onChange={setStatusDescription} />
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} md={2}>
                            <Typography variant="subtitle2" color={grey[800]} m={1}>Status:</Typography>
                            <FormControl sx={{ m: 1, minWidth: 120, }}>
                                <InputLabel htmlFor="input-status">Status</InputLabel>
                                <Select
                                    labelId="input-status-label"
                                    id="input-status"
                                    value={status ?? props.patient?.status}
                                    onChange={handleStatusChange}
                                    input={<OutlinedInput label="Status" />}
                                >
                                    {Object.values(ReferralStatus).map((currStatus) => (
                                        <MenuItem key={currStatus} value={currStatus}>{currStatus}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <Typography variant="subtitle2" color={grey[800]} mb={1}>Notes:</Typography>
                        <DraftTextInput id={"input-notes"} value={notes} onChange={setNotes} />
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button color="error" onClick={handleClose}>Cancel</Button>
                <Button color="primary" onClick={handleClose}>Save</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ReferralStatusDialog;
