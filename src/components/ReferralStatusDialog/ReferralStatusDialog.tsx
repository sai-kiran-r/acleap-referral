import React from "react";
import { ACLPatient, ACLPatientAlert } from "../../types";
import { Box, Button, Card, Container, Dialog, TextField, DialogActions, DialogContent, Paper, DialogTitle, FormControl,
         Grid, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer,
         TableHead, TableRow, Typography, TablePagination, TableFooter } from "@mui/material";
import { ReferralStatus } from "../../utils/constants";
import { useTheme } from '@mui/material/styles';
import { grey, blue, red } from "@mui/material/colors";
import { getPatientAndServiceRequests} from "../../services/fhirServices";
import { transformPatient } from "../../services/fhirUtil";
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

type ReferralStatusDialogProps = {
    open: boolean,
    onClose: () => void,
    patient?: ACLPatientAlert,
}

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
      event: React.MouseEvent<HTMLButtonElement>,
      newPage: number,
    ) => void;
  }

function TablePaginationActions(props: TablePaginationActionsProps) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>,
    ) => {
      onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  }

type Order = 'asc' | 'desc';

function createData(
    noteText: string,
    author: string,
    date: string,
) {
    return{ noteText, author, date}
}

const rows = [
    createData('Assigned Armando for Outreach', 'Armando Garcia','01/01/23')
];

const ReferralStatusDialog = (props: ReferralStatusDialogProps) => {

    const [patient, setPatient] = React.useState<ACLPatient | 'loading' | 'error'>('loading')
    const [status, setStatus] = React.useState<ReferralStatus | undefined>(props.patient?.status)
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    React.useEffect(() => {
        (async () => {
            const { patient, serviceRequests } = await getPatientAndServiceRequests();
            console.log("Transformed Patient data:", patient);
            console.log("Transformed Service Requests:", serviceRequests);
            const transformedPatient = transformPatient(patient)
            setPatient(transformedPatient)
        })();
    }, [])

    const handleClose = (_: React.SyntheticEvent<unknown>, reason?: string) => {
        if (reason !== 'backdropClick') {
            setStatus(undefined)
            props.onClose();
        }
    }

    const handleStatusChange = (event: SelectChangeEvent<typeof status>) => {
        setStatus(event.target.value as ReferralStatus);
    };

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
      ) => {
        setPage(newPage);
      };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      }

    return (
    <Dialog disableEscapeKeyDown open={props.open} onClose={handleClose} maxWidth={'lg'} fullWidth className="dialogue-size">
        <DialogTitle>Referral: {props.patient?.firstName} {props.patient?.lastName}</DialogTitle>
        <DialogContent dividers>
            <Box>
                <Typography variant="h6"><b>Referral Information</b></Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Card variant="outlined">
                            <div style={{ height:350, padding: '4px' }}>
                                <Container className={''}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={6}>
                                            <Paper className={""} elevation={0}>
                                                {
                                                patient === 'loading' ? (
                                                <Typography variant="subtitle1" color={blue}>Loading patient data...</Typography>
                                                ) :
                                                patient === 'error' ? (
                                                <Typography variant="subtitle1" color={red}>Unable to load patient data. Please login.</Typography>
                                                ) : (
                                                <>
                                                <Typography variant="body1" my={1}><b>First name: </b>{patient.firstName}</Typography>
                                                <Typography variant="body1" my={1}><b>Last name: </b>{patient.lastName}</Typography>
                                                <Typography variant="body1" my={1}><b>Birth date: </b>{patient.birthDate}</Typography>
                                                <Typography variant="body1" my={1}><b>Gender: </b>{patient.gender}</Typography>
                                                <Typography variant="body1" my={1}><b>Ethnicity: </b>{patient.ethnicity}</Typography>
                                                <Typography variant="body1" my={1}><b>Phone: </b>{patient.phone}</Typography>
                                                <Typography variant="body1" my={1}><b>E-mail: </b>{patient.email}</Typography>
                                                <Typography variant="body1" my={1}><b>Referral ID: </b>{patient.id}</Typography>
                                                </>
                                                )}
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Paper className={""} elevation={0}>
                                                {
                                                patient === 'loading' ? (
                                                <Typography variant="subtitle1" color={blue}>Loading patient data...</Typography>
                                                ) :
                                                patient === 'error' ? (
                                                <Typography variant="subtitle1" color={red}>Unable to load patient data. Please login.</Typography>
                                                ) : (
                                                <>
                                                <Typography variant="body1" my={1}><b>Service Requested </b>Housing - Translife Care</Typography>
                                                <Typography variant="body1" my={1}><b>Race </b>{patient.race}</Typography>
                                                <Typography variant="body1" my={1}><b>Sex at Birth </b>{patient.sexAtBirth}</Typography>
                                                <Typography variant="body1" my={1}><b>Gender Identity </b>Cisgender Female</Typography>
                                                <Typography variant="body1" my={1}><b>Sexual Orientation </b>Bisexual</Typography>
                                                </>
                                                )}
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </Container>
                            </div>
                        </Card>
                    </Grid>
                    <Grid item xs={6}>
                        <Card variant="outlined">
                            <div style={{ height:350, padding: '16px' }}>
                            <Typography><b>Initial Referral Note:</b></Typography>
                            <Typography>test #3\r\nComments and instructions will show up here\n..</Typography>
                            </div>
                        </Card>
                    </Grid>
                </Grid>
                <br></br>
                <Typography variant="subtitle1" color={grey[800]} mb={1}><b>Notes History</b></Typography>
                <TableContainer component={({ children, ...props }) => <Card {...props} variant="outlined">{children}</Card>}>
                        <Table sx={{ minWidth: 700 }} aria-label="custom pagination table">
                            <TableHead>
                                <TableCell>Note text</TableCell>
                                <TableCell>Author</TableCell>
                                <TableCell>Date</TableCell>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell width={800}>Assigned Armando for Outreach</TableCell>
                                    <TableCell>Armando Garcia</TableCell>
                                    <TableCell>01/01/23</TableCell>
                                </TableRow>
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={3}
                                    count={rows.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: {
                                        'aria-label': 'rows per page',
                                        },
                                    native: true,
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />
                                </TableRow>
                            </TableFooter>
                        </Table>
                        </TableContainer>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <div style={{ padding: '16px' }}>
                            <form>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                    <Typography variant="subtitle2" color={grey[800]} m={1}>Assigned Status</Typography>
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
                                    <Grid item xs={12}>
                                    <Typography variant="subtitle2" color={grey[800]} m={1}>Assigned Owner</Typography>
                                    <FormControl sx={{ m: 1, minWidth: 120, }}>
                                        <InputLabel htmlFor="input-status">Owner</InputLabel>
                                        <Select
                                            labelId="input-owner-label"
                                            id="input-owner"
                                            onChange={handleStatusChange}
                                            input={<OutlinedInput label="Owner" />}
                                        >
                                            <MenuItem value={"Armando Garcia"}>Armando Garcia</MenuItem>
                                            <MenuItem value={"Owen Davis"}>Owen Davis</MenuItem>
                                        </Select>
                                    </FormControl>
                                    </Grid>
                                </Grid>
                            </form>
                        </div>
                    </Grid>
                    <Grid item xs={8}>
                        <div style={{ padding: '16px' }}>
                        <Typography variant="subtitle2" color={grey[800]} mb={1}>Add Notes(optional) </Typography>
                            <TextField
                                label="Enter Text"
                                multiline
                                fullWidth
                                variant="outlined"
                                rows={4}
                            />
                         <Typography variant="caption" color={grey[800]} mb={1}>0/100</Typography>
                        </div>
                    </Grid>
                </Grid>
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
