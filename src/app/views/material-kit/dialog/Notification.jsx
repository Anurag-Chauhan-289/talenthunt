import { Box, Divider, Grid, styled } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { endPointName } from 'apis/apiList';
import { CallAPI } from 'apis/callAPI';
import { catchError } from 'app/firebase/Crashlytics';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

const StyledButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(1),
}));

export default function NotificationPopUp({ open, handleClose, usersList, isAllSelected }) {

    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const columns = [
        {
            name: 'Full Name',
            selector: row => row.firstName + ' ' + row.lastName,
            sortable: true,
            width: '20%',
        },
        {
            name: 'Age',
            selector: row => row.age,
            width: '10%',
            // center: true
        },
        {
            name: 'Gender',
            selector: row => row.gender == 0 ? 'Male' : 'Female',
            width: '10%',
            // center: true
        },
        {
            name: 'City',
            selector: row => row.city,
            sortable: true,
            width: '20%',
        },
        {
            name: 'Remove',
            center: true,
            width: '20%',
            selector: row =>
                <StyledButton variant="outlined" color="primary" style={{ height: '30px', paddingRight: -5 }} onClick={() => handleClickRmove(row)}>
                    Remove
                </StyledButton>
        },
    ]

    const handleClickRmove = (row) => {
        /**
         * Remove user from selected user's list
         */
    }

    const onPressSend = async () => {
        try {
            console.log("Selected Users ==> ", usersList)
            const fcmTokenList = usersList.map(el => el.fcmToken)
            debugger
            const payload = {
                deviceIds: fcmTokenList,
                notificationTitle: title,
                notificationMessage: message,
                notificationType: 1
            }
            let response = await CallAPI(endPointName.PushNotification, 'post', payload);
            console.log(response)
        } catch (error) {
            catchError(error, "Notification_1")
        }
    }

    useEffect(() => {

    }, []);

    return (
        <Box>
            <Dialog open={open}
                fullWidth={true}
                maxWidth={'md'}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Notifcation</DialogTitle>
                <Divider />
                <DialogContent>

                    <Grid container spacing={6}>
                        <Grid item xs={4}>
                            <p style={{ paddingTop: 25 }}>Title*</p>
                            <p style={{ paddingTop: 25 }}>Message*</p>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Title"
                                type="email"
                                fullWidth
                                onChange={(event) => setTitle(event.target.value)}
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Message"
                                type="email"
                                fullWidth
                                onChange={(event) => setMessage(event.target.value)}
                            />
                        </Grid>
                    </Grid>
                    {
                        (usersList.length == 0 || isAllSelected) ?
                            <p style={{ textAlign: 'center', paddingTop: 15 }}>{"A notification would be sent to all"} </p>
                            :
                            <DataTable
                                columns={columns}
                                data={usersList}
                                highlightOnHover
                                // dense
                                pagination
                                responsive
                                selectableRows
                            />
                    }
                </DialogContent>
                <DialogActions style={{ marginBottom: 16 }}>
                    <Button variant="outlined" color="primary" onClick={onPressSend}>
                        send
                    </Button>
                    <Button variant="outlined" color="primary" onClick={handleClose}>
                        close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
