import React,{useState,useEffect} from "react";
import { ACLPatient, ACLServiceRequest, ACLTasks, ACLPractitionerRole } from "../../types";
import { Box, Button, Card, Container, Dialog, TextField, DialogActions, DialogContent, Paper, DialogTitle, FormControl,
         Grid, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer,
         TableHead, TableRow, Typography, TablePagination, TableFooter, TableSortLabel } from "@mui/material";
import { ReferralStatus } from "../../utils/constants";
import { useTheme } from '@mui/material/styles';
import { grey } from "@mui/material/colors";
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
// import { getTaskById } from "../../services/fhirServices";
import {updateData } from "../../services/azureFhirResource";

type ReferralStatusDialogProps = {
    open: boolean ,
    onClose: () => void,
    patient?: ACLPatient,
    service?: ACLServiceRequest,
    tasks?: ACLTasks,
    practitionerRole?: ACLPractitionerRole,
    getData:() => void ,
}

interface formDataType  {
  businessStatus:any,owner:any,note:any
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

const ReferralStatusDialog = (props: ReferralStatusDialogProps) => {

    const [status, setStatus] = useState<ReferralStatus | undefined>(props.tasks?.taskBusinessStatus)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [practitionerName, setPractitionerName] = useState<ACLPractitionerRole>([]);
    const [formData, setFormData] = useState<formDataType>({businessStatus:'',owner:'',note:''});
    const [taskOwner, setTaskOwner] = useState<string | undefined>(props.tasks?.taskOwner);
    // const [taskById, setTaskById] = useState<any>(null);
    const [textLength, setTextLength] = useState(0);
    const [noNotes, setnoNotes] = useState<boolean>(true);
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");
    


    useEffect(() => {
      if (props.tasks) {
          // Check if taskNotes exist
          const hasTaskNotes = props.tasks.taskNotes !== undefined;
          setnoNotes(!hasTaskNotes);

          // Update practitioner names
          if (props.practitionerRole) {
              const practitionerNames = props.practitionerRole.map((practitioner: ACLPractitionerRole) => practitioner.practitionerName);
              setPractitionerName(practitionerNames);
          }

          // Update status
          const getStatus = () => {
              if (props.tasks?.taskBusinessStatus !== undefined) {
                  if (Object.values(ReferralStatus).includes(props.tasks.taskBusinessStatus)) {
                      return props.tasks.taskBusinessStatus;
                  }
                  return ReferralStatus.Received;
              }
          };
          setStatus(getStatus());
      }
  }, [props.tasks, props.practitionerRole]);

    const handleRequestSort = (columnKey: string) => {
      const newSortDirection = 
          sortColumn === columnKey && sortDirection === "desc" ? "asc" : "desc";
      setSortColumn(columnKey);
      setSortDirection(newSortDirection);
    };
    
    interface ACLNote {
      noteText: string;
      noteAuthor: string;
      noteAuthoredDate: string; 
  }
  
    const sortedNotes = props.tasks?.taskNotes ? [...props.tasks?.taskNotes].sort((a: ACLNote, b: ACLNote) => {
      const dateA = new Date(a.noteAuthoredDate);
      const dateB = new Date(b.noteAuthoredDate);
  
      if (sortDirection === "asc") {
          return dateA.getTime() - dateB.getTime();
      } else {
          return dateB.getTime() - dateA.getTime();
      }
  }) : [];
  

    const handleClose = (_: React.SyntheticEvent<unknown>, reason?: string) => {
        if (reason !== 'backdropClick') {
            setStatus(undefined)
              let payload = {
                ...formData,
                createdDate:new Date().toISOString()
              }
            props.onClose();
        }
    }

    const handleStatusChange = (event: SelectChangeEvent<typeof status>) => {
        const { value,name }= event.target;
        setStatus(value as ReferralStatus);
        setFormData({...formData,[name]:value})
    };

    const handleOwnerChange = (event: SelectChangeEvent<string>) => {
        const { value, name } = event.target;
        setTaskOwner(value);
        setFormData({ ...formData, [name]: value });
    };

    const handleStatusTextChange = (event:  React.ChangeEvent<HTMLInputElement>) => {
      const { value,name }= event.target;
      setFormData({...formData,[name]:value})
      // Set the new text length state
      setTextLength(value.length);
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
      };

    const handleSave = () => {
        const {businessStatus,owner,note}= formData;
        const taskById:any =  props.tasks?.taskFHIRId;
        const payload =[];

        if (taskById  !== null) {
          if (businessStatus!=="") {
              payload.push( { "op": "replace", "path": "/businessStatus/text", "value":businessStatus})
          }
          if (owner !== "") {
            // Find the owner ID using the provided owner name
            const roleOwnerid = props.practitionerRole?.find((x: ACLPractitionerRole) => x.practitionerName === owner);
            const { practitionerRoleId } = roleOwnerid;

            // Update the owner's reference and display properties
            payload.push( { "op": "replace", "path": "/owner/reference", "value":'PractitionerRole/' + practitionerRoleId})
            payload.push( { "op": "replace", "path": "/owner/display", "value":owner})
          }
          // Assuming note to be a string, add it to the note array
          if (note && note.trim() !== "" && owner !== "" && noNotes) {
            setnoNotes(false);
            const ownerid = props.practitionerRole?.find((x: ACLPractitionerRole) => x.practitionerName === owner);
            const { practitionerid } = ownerid;
            payload.push( { "op": "add", "path": "/note", "value":{
              "authorReference": {
              "display": `${owner}`,
              "reference": "Practitioner/" + practitionerid
            },
            "text": `${note}`,
            "time": new Date().toISOString()
            }});
          }
          if (note && note.trim() !== "" && owner !== "" && !noNotes) {
            setnoNotes(false);
            const ownerid = props.practitionerRole?.find((x: ACLPractitionerRole) => x.practitionerName === owner);
            const { practitionerid } = ownerid;
            payload.push( { "op": "add", "path": "/note/-", "value":{
              "authorReference": {
              "display": `${owner}`,
              "reference": "Practitioner/" + practitionerid
            },
            "text": `${note}`,
            "time": new Date().toISOString()
            }});
          }
          if (note && note.trim() !== "" && noNotes) {;
            setnoNotes(false);
            const ownerid = props.practitionerRole?.find((x: ACLPractitionerRole) => x.practitionerName === taskOwner);
            const { practitionerid } = ownerid;
            payload.push( { "op": "add", "path": "/note", "value":{
              "authorReference": {
              "display": `${taskOwner}`,
              "reference": "Practitioner/" + practitionerid
            },
            "text": `${note}`,
            "time": new Date().toISOString()
            }});
          }
          if (note && note.trim() !== "" && !noNotes) {
            setnoNotes(false);
            const ownerid = props.practitionerRole?.find((x: ACLPractitionerRole) => x.practitionerName === taskOwner);
            const { practitionerid } = ownerid;
            payload.push( { "op": "add", "path": "/note/-", "value":{
              "authorReference": {
              "display": `${taskOwner}`,
              "reference": "Practitioner/" + practitionerid
            },
            "text": `${note}`,
            "time": new Date().toISOString()
            }});
          }
          updateData(taskById,payload).then((res)=>{
          props.getData();
          props.onClose();
          alert("Task Resource is been updated successfully");
          })
        }
    }

    const {patient,service,tasks } = props;

    return (
    <Dialog disableEscapeKeyDown open={props.open} onClose={handleClose} maxWidth={'lg'} fullWidth className="dialogue-size">
        <DialogTitle>Referral: {patient?.firstName} {patient?.lastName}</DialogTitle>
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
                                                <>
                                                <Typography variant="body1" my={1}><b>First name: </b>{patient?.firstName}</Typography>
                                                <Typography variant="body1" my={1}><b>Last name: </b>{patient?.lastName}</Typography>
                                                <Typography variant="body1" my={1}><b>Birth date: </b>{patient?.birthDate}</Typography>
                                                <Typography variant="body1" my={1}><b>Gender: </b>{patient?.gender}</Typography>
                                                <Typography variant="body1" my={1}><b>Ethnicity: </b>{patient?.ethnicity}</Typography>
                                                <Typography variant="body1" my={1}><b>Phone: </b>{patient?.phone}</Typography>
                                                <Typography variant="body1" my={1}><b>E-mail: </b>{patient?.email}</Typography>
                                                <Typography variant="body1" my={1}><b>Referral ID: </b>{service?.referralID}</Typography>
                                                </>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Paper className={""} elevation={0}>
                                                <>
                                                <Typography variant="body1" my={1}><b>Service Requested </b>{service?.serviceRequested}</Typography>
                                                <Typography variant="body1" my={1}><b>Race </b>{patient?.race}</Typography>
                                                <Typography variant="body1" my={1}><b>Sex at Birth </b>{patient?.sexAtBirth}</Typography>
                                                <Typography variant="body1" my={1}><b>Gender Identity </b>{patient?.genderIdentity}</Typography>
                                                <Typography variant="body1" my={1}><b>Sexual Orientation </b>{patient?.sexualOrientation}</Typography>
                                                </>
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
                            <Typography>{service?.intialReferralNote}</Typography>
                            </div>
                        </Card>
                    </Grid>
                </Grid>
                <br></br>
                <Typography variant="subtitle1" color={grey[800]} mb={1}><b>Notes History</b></Typography>
                <TableContainer component={({ children, ...props }) => <Card {...props} variant="outlined">{children}</Card>}>
                        <Table sx={{ minWidth: 700 }} aria-label="custom pagination table">
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <TableSortLabel
                                    active={sortColumn === "noteText"}
                                    direction={sortDirection}
                                    onClick={() => handleRequestSort("noteText")}
                                  ><b>
                                    Note Text
                                  </b>
                                  </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                  <TableSortLabel
                                    active={sortColumn === "noteAuthor"}
                                    direction={sortDirection}
                                    onClick={() => handleRequestSort("noteAuthor")}
                                  ><b>
                                    Assigned Owner
                                  </b>
                                  </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                  <TableSortLabel
                                    active={sortColumn === "noteAuthoredDate"}
                                    direction={sortDirection}
                                    onClick={() => handleRequestSort("noteAuthoredDate")}
                                  ><b>
                                    Date
                                  </b>
                                  </TableSortLabel>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                                { tasks?.taskNotes === undefined ?
                                    <TableRow>
                                      <TableCell colSpan={12}><div className="container ">
                                        <div className="row">
                                        <div className="col-12">
                                        <div className="d-flex justify-content-center align-items-center">No Notes Exist for this Service Request</div>
                                        </div>
                                        </div>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  : sortedNotes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((tasknote : any, index) => (
                                        <TableRow key={index}>
                                            <TableCell width={800}>{tasknote?.noteText}</TableCell>
                                            <TableCell>{tasknote?.noteAuthor}</TableCell>
                                            <TableCell>{tasknote?.noteAuthoredDate}</TableCell>
                                        </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={3}
                                    count={tasks?.taskNotes?.length || 0}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
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
                                            name="businessStatus"
                                            value={status === undefined ? "Received" as ReferralStatus : status}
                                            onChange={handleStatusChange}
                                            input={<OutlinedInput label="Status" />
                                          }
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
                                            name="owner"
                                            value={taskOwner}
                                            onChange={handleOwnerChange}
                                            input={<OutlinedInput label="Owner" />}
                                        >
                                            {practitionerName.map((name: any, index: any) => (
                                            <MenuItem key={index} value={name}>{name}</MenuItem>
                                            ))}
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
                                name="note"
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                  handleStatusTextChange(event);
                                }}
                                inputProps={{ maxLength: 100 }}
                            />
                        <Typography variant="caption" color={grey[800]} mb={1}>{textLength}/100</Typography>
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </DialogContent>
        <DialogActions>
            <Button color="error" onClick={handleClose}>Cancel</Button>
            <Button color="primary" onClick={handleSave}>Save</Button>
        </DialogActions>
    </Dialog>
    )
}

export default ReferralStatusDialog;
