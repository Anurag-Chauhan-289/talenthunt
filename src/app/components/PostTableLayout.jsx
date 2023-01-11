import {
    Box,
    Icon,
    Button,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import moment from "moment";
import { SimpleCard } from "app/components";

const PostTableLayout = ({ posts, columns }) => {

    const navigate = useNavigate();
    const [selectedRows, setSelectedRows] = useState([]);
    const [openUpadteModal, setOpenUpadteModal] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [singlePostData, setSinglePostData] = useState()

    function handleClose() {
        setOpenUpadteModal(false);
        setOpenViewModal(false);
    }



    const customStyles = {
        rows: {
            style: {
                // minHeight: '72px', // override the row height
            },
        },
        headCells: {
            style: {
                // paddingLeft: '8px', // override the cell padding for head cells
                // paddingRight: '8px'
            },
        },
        cells: {
            style: {
                paddingTop: '8px', // override the cell padding for data cells
                paddingBottom: '8px',
            },
        },
    };
    const onClickEdit = (row) => {
        console.log('Row ==> ', row)
        setSinglePostData(row);
        setOpenUpadteModal(true);
    };

    const onClickView = (row) => {
        setOpenUpadteModal(false);
        // setOpenViewModal(true);
        setSinglePostData(row);
        navigate('/post/DetailPost', { state: { postData: row } });
    }

    const selectProps = { indeterminate: isIndeterminate => isIndeterminate };

    const handleRowSelected = useCallback(state => {
        setSelectedRows(state.selectedRows);
    }, []);


    return (
        <>
            <Box width="100%" >
                {/* {renderTableLayout_old()} */}
                <DataTable
                    columns={columns}
                    data={posts}
                    // selectableRows
                    // selectableRowsComponentProps={selectProps}
                    onSelectedRowsChange={handleRowSelected}
                    highlightOnHover
                    // dense
                    pagination
                    responsive
                    // progressPending={''}
                    customStyles={customStyles}
                    dense
                />
            </Box>
            {openUpadteModal &&
                <div>
                    <Dialog open={openUpadteModal} onClose={handleClose} style={{ maxWidth: '100%', backgroundColor: 'yellow' }}>
                        <div style={{ maxWidth: '750px', backgroundColor: 'green' }}>
                            <DialogTitle id="form-dialog-title">Update Post</DialogTitle>
                            <DialogContent>
                                <DialogContentText>

                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="Email Address"
                                    type="email"
                                    fullWidth
                                />
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="Email Address"
                                    type="email"
                                    fullWidth
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button variant="outlined" color="secondary" onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button variant="outlined" onClick={handleClose} color="primary">
                                    Submit
                                </Button>
                            </DialogActions>
                        </div>
                    </Dialog>
                </div>
            }
        </>
    );
};

export default PostTableLayout;  