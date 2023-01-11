
import React, { useEffect, useState } from 'react';
import {
    Button,
    Stack,
    Typography,
    styled,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Autocomplete,
    TextField,
} from '@mui/material';
import { Breadcrumb, SimpleCard } from 'app/components';
import { CallAPI } from 'apis/callAPI';
import { endPointName } from 'apis/apiList';
import Loading from 'app/components/MatxLoading';
import { useLocation } from 'react-router-dom';
import { Paragraph } from 'app/components/Typography';
import moment from 'moment';
import PaginationTable from '../material-kit/tables/PaginationTable';
import { CgProfile } from 'react-icons/cg';
import { Cloud_Logo, Audition_Icon, Email_Logo, Whatsapp_Logo, Twitter_Logo, Fb_Logo, IMDb_Logo, YT_Logo, Insta_Logo } from '../../../images';
import { cmToFeetInches } from "utils/utilities";
import { facebookURL, gmailURL, instagramURL, stagesListData, stageStatus, twitterURL, whatsAppURL, youtubeURL } from "app/constant";
import { SocialMediaLayout } from "app/components";
import { catchError } from 'app/firebase/Crashlytics';
import { Box } from '@mui/system';
import DataTable from 'react-data-table-component';

const Container = styled('div')(({ theme }) => ({
    margin: '30px',
    [theme.breakpoints.down('sm')]: { margin: '16px' },
    '& .breadcrumb': {
        marginBottom: '30px',
        [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(1),
}));

const DetailPost = () => {
    const { state } = useLocation();

    const [postData, setPostData] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [openStageDialog, setOpenStageDialog] = useState(false);
    const [selectedRowData, setselectedRowData] = useState();

    const columns = [
        {
            name: 'DP',
            center: true,
            width: '8%',
            selector: row => {
                return (
                    row.profileImage == null ?
                        <CgProfile size={40} />
                        :
                        <img src={row.profileImage} style={{ height: 40, width: 40, borderRadius: 20 }} />)
            },
        },
        {
            name: 'Full Name',
            selector: row => row.firstName + ' ' + row.lastName,
            sortable: true,
            width: '13%',
        },
        {
            name: 'Age',
            selector: row => row.age,
            width: '4%',
            // center: true
        },
        {
            name: 'Weight(Kg)',
            selector: row => row.weight,
            width: '7%',
        },
        {
            name: 'Height',
            selector: row => cmToFeetInches(row.height),
            width: '7%',
            // center: true
        },
        {
            name: 'Gender',
            selector: row => row.gender == 0 ? 'Male' : 'Female',
            sortable: true,
            width: '6%',
            // center: true
        },
        {
            name: 'City',
            selector: row => row.city,
            sortable: true,
            width: '14%',
        },
        {
            name: 'Mobile No',
            selector: row => row.mobileNumber,
            width: '8%',
        },
        {
            name: 'Connect',
            selector: row => {
                return ([row.mobileNumber !== '' && row.mobileNumber !== null && row.mobileNumber !== undefined ?
                    <SocialMediaLayout
                        key={row.userId}
                        url={whatsAppURL + row.mobileNumber}
                        icon={Whatsapp_Logo}
                        iconStyle={{ width: '32px', height: '32px' }}
                    />
                    : '',
                row.emailId !== '' && row.emailId !== null && row.emailId !== undefined ?
                    <SocialMediaLayout
                        key={row.userId}
                        url={gmailURL + row.emailId}
                        // children={<SiGmail size={30} color='blue' />}
                        icon={Email_Logo}
                        children={<img className="ml-1 mr-2" style={{ width: '40px', height: '40px', marginLeft: 7 }} src={Email_Logo} />}
                        iconStyle={{ width: '24px', height: '18px' }}
                    />
                    : ''
                ])
            },
            width: '7%'
        },
        // {
        //   name: 'Social',
        //   selector: row => {
        //     return ([
        //       row.facebookURL !== '' && row.facebookURL !== null && row.facebookURL !== undefined ? <SocialMediaLayout url={facebookURL + row.facebookURL} icon={Fb_Logo} iconStyle={{ width: '28px', height: '28px' }} /> : '',
        //       row.instagramId !== '' && row.instagramId !== null && row.instagramId !== undefined ? <SocialMediaLayout url={instagramURL + row.instagramId} icon={Insta_Logo} iconStyle={{ width: '28px', height: '28px', marginLeft: 7 }} /> : '',
        //       row.twitterURL !== '' && row.twitterURL !== null && row.twitterURL !== undefined ? <SocialMediaLayout url={twitterURL + row.twitterURL} icon={Twitter_Logo} iconStyle={{ width: '32px', height: '32px', marginLeft: 7 }} /> : '',
        //       row.youTubeId !== '' && row.youTubeId !== null && row.youTubeId !== undefined ? <SocialMediaLayout url={youtubeURL + row.youTubeId} icon={YT_Logo} iconStyle={{ width: '32px', height: '34px', marginLeft: 7 }} /> : '',
        //       row.imdbProfile !== '' && row.imdbProfile !== null && row.imdbProfile !== undefined ? <SocialMediaLayout url={row.imdbProfile} icon={IMDb_Logo} iconStyle={{ width: '28px', height: '26px', marginLeft: 7 }} /> : '',
        //       row.otherProfile !== '' && row.otherProfile !== null && row.otherProfile !== undefined ? <SocialMediaLayout url={row.otherProfile} icon={Cloud_Logo} iconStyle={{ width: '30px', height: '30px', marginLeft: 7 }} /> : '',
        //       row.monologueLink !== '' && row.monologueLink !== null && row.monologueLink !== undefined ? <SocialMediaLayout url={row.monologueLink} icon={Audition_Icon} iconStyle={{ width: '30px', height: '28px', marginLeft: 7 }} /> : ''
        //     ])
        //   },
        //   width: '23%'
        // },
        {
            name: 'Applied On',
            selector: row => moment(row.appliedOn).format('DD MMM YYYY'),
            width: '7%'
        },
        {
            name: ' Stage',
            selector: row => {
                return (
                    <StyledButton variant="outlined" color="primary" style={{ height: '30px', paddingRight: -5 }} onClick={() => handleClickOpenDialog(row)}>
                        {row.stage}
                    </StyledButton>
                )
            },
            width: '8%'
        },
        {
            name: 'Status',
            selector: row => {
                return (
                    <p>Not Actioned</p>
                )
            },
            width: '8%'
        }
    ];

    const stageHistoryColumns = [

        {
            name: 'Stage',
            selector: row => <p>Stage 1</p>,
            width: '20%',
        },
        {
            name: 'Status',
            selector: row => <p>Not Actioned</p>,
            width: '15%',
            // center: true
        },
        {
            name: 'Selected On',
            selector: row => moment().format('DD MMM YYYY'),
            width: '15%'
        },

        {
            name: 'Remark',
            selector: row => {
                return (
                    <p>Not Actioned</p>
                )
            },
            width: '50%'
        }
    ];


    function handleClickOpenDialog(data) {
        setOpenStageDialog(true);
        setselectedRowData(data)
    }

    function handleCloseDialog() {
        setOpenStageDialog(false);
    }

    const callUserListApi = async () => {
        try {
            const payload = {
                postId: state.postData.postId
            }
            let response = await CallAPI(endPointName.getAdminPostAppliedUsersList, "POST", payload);
            if (response != 'error') {
                setAllUsers(response);
            } else {
                setAllUsers([])
            }
        } catch (error) {
            catchError(error, 'DetailPost_1');
        }
    }

    const getPostDetailApi = async () => {
        try {
            const payload = {
                postId: state.postData.postId
            }
            let response = await CallAPI(endPointName.getPostDetails, "POST", payload);
            if (response != 'error') {
                setPostData(response);
            } else {
                setPostData("");
            }
        } catch (error) {
            catchError(error, 'DetailPost_2');
        }
    }

    useEffect(() => {
        getPostDetailApi();
        callUserListApi();

    }, [])

    const handleViewprofileBtn = (row) => {
        let tempWindow = window.open("/users/UserDetails?UserId=" + row.userId, '_blank')
        tempWindow.userId = row.userId
    }

    return (
        <Container>
            <Box className="breadcrumb">
                <Breadcrumb routeSegments={[state.location == "UserDetails" ? { name: 'User Details', path: '/users/UserDetails' } : { name: 'Post', path: '/post/ListPost' }, { name: 'Detail Post' }]} />
            </Box>
            <div style={{ margin: 10 }}>
                {
                    allUsers.length == 0 && !postData ?
                        <Loading />
                        :
                        <>
                            <Stack spacing={3}>
                                {postData != "" ?
                                    <SimpleCard>
                                        <div style={{ paddingLeft: 20 }}>
                                            <Stack direction={'row'}>

                                                <Stack>
                                                    <Typography style={{ fontWeight: 'bold' }}>({postData.postId}) {postData.title}</Typography>
                                                </Stack>
                                            </Stack>
                                            <Stack direction={'row'}>
                                                <Stack>
                                                    <Typography style={{ paddingBottom: 5 }}>{postData.description}</Typography>
                                                </Stack>
                                            </Stack>
                                            <Stack direction={'row'}>
                                                <Stack style={{ paddingRight: 40 }}>

                                                    <Typography style={{ fontWeight: 'bold' }}>{moment(postData.publishOn).format('DD MMM YYYY')}</Typography>
                                                    <Typography>Published On</Typography>
                                                </Stack>
                                                <Stack style={{ paddingRight: 40 }} >

                                                    <Typography style={{ fontWeight: 'bold' }}>{moment(postData.validTill).format('DD MMM YYYY')}</Typography>
                                                    <Typography>Valid Till</Typography>
                                                </Stack>
                                                <Stack style={{ paddingRight: 40 }} >

                                                    <Typography style={{ fontWeight: 'bold' }}>{postData.gender == 0 ? 'Male' : 'Female'}</Typography>
                                                    <Typography>Gender</Typography>
                                                </Stack>
                                                <Stack style={{ paddingRight: 40 }} >

                                                    <Typography style={{ fontWeight: 'bold' }}>{postData.ageFrom} - {postData.ageTo}</Typography>
                                                    <Typography>Age</Typography>
                                                </Stack>
                                                <Stack style={{ paddingRight: 40 }}>
                                                    <Stack direction={'row'} >

                                                        {postData.category !== "" && postData.category.length > 0 ?
                                                            postData.category.map((el, index) => {
                                                                return (
                                                                    <div key={index}>

                                                                        <Typography style={{ fontWeight: 'bold', marginRight: 5 }}>{el.workExpCategoryName}{postData.category.length - 1 && postData.category.length - 1 != index ? ',' : null} </Typography>
                                                                    </div>
                                                                )
                                                            })
                                                            :
                                                            <Typography style={{ fontWeight: 'bold' }}> -- </Typography>
                                                        }
                                                    </Stack>
                                                    <Typography>Category</Typography>
                                                </Stack>
                                                <Stack style={{ paddingRight: 40 }}>
                                                    <Stack direction={'row'} >

                                                        {postData.city !== "" && postData.city.length > 0 ?
                                                            postData.city.map((el, index) => {
                                                                return (
                                                                    <Typography style={{ fontWeight: 'bold', marginRight: 5 }}>{el.city}{postData.city.length > 1 && postData.city.length - 1 != index ? ',' : null}</Typography>
                                                                )
                                                            })
                                                            :
                                                            <Typography style={{ fontWeight: 'bold' }}> -- </Typography>
                                                        }
                                                    </Stack>
                                                    <Typography>City</Typography>
                                                </Stack>
                                                <Stack style={{ paddingRight: 40 }}>
                                                    <Stack direction={'row'} >

                                                        {postData.state !== "" && postData.state.length > 0 ?
                                                            postData.state.map((el, index) => {
                                                                return (
                                                                    <Typography style={{ fontWeight: 'bold', marginRight: 5 }}>{el.state}{postData.state.length > 1 && postData.state.length - 1 != index ? ',' : null}</Typography>
                                                                )
                                                            })
                                                            :
                                                            <Typography style={{ fontWeight: 'bold' }}> -- </Typography>
                                                        }
                                                    </Stack>
                                                    <Typography>State</Typography>
                                                </Stack>
                                                <Stack style={{ paddingRight: 40 }}>
                                                    <Stack direction={'row'} >

                                                        {postData.language !== "" && postData.language.length > 0 ?
                                                            postData.language.map((el, index) => {
                                                                return (
                                                                    <Typography style={{ fontWeight: 'bold', marginRight: 5 }}>{el.languageName}{postData.language.length > 1 && postData.language.length - 1 != index ? ',' : null}</Typography>
                                                                )
                                                            })
                                                            :
                                                            <Typography style={{ fontWeight: 'bold' }}> -- </Typography>
                                                        }
                                                    </Stack>
                                                    <Typography>Language Fluency</Typography>
                                                </Stack>

                                            </Stack>
                                            <div>
                                                {/* <Stack direction={'row'}>
                                        <Stack style={{ paddingRight: 40 }}>
                                            {allDetails.singleUserData.gender !== null && allDetails.singleUserData.gender == 1 ?
                                                <Typography style={{ fontWeight: 'bold' }}>Female</Typography>
                                                :
                                                <Typography style={{ fontWeight: 'bold' }}>Male</Typography>
                                            }
                                            <Typography>Gender</Typography>
                                        </Stack>
                                    </Stack> */}
                                                {/* <table>
                                        <tr>
                                            <td><Typography style={{ fontWeight: 'bold' }}>Title:</Typography> </td>
                                            <td style={{ paddingLeft: 5 }}><Paragraph>{postData.title}</Paragraph></td>
                                        </tr>
                                        <tr>
                                            <td><Typography style={{ fontWeight: 'bold' }}>Description:</Typography></td>
                                            <td style={{ paddingLeft: 5 }}><Paragraph>{postData.description}</Paragraph></td>
                                        </tr>
                                    </table> */}
                                                {/* <div style={{ flex: 1, flexDirection: 'row', display: 'flex', paddingTop: 5, paddingBottom: 5 }}>
                                        <Typography style={{ fontWeight: 'bold' }}>Published On: </Typography>
                                        <Typography style={{ paddingLeft: 10 }}>{moment(postData.publishOn).format('DD MMM YYYY')}</Typography>
                                        <Typography style={{ marginLeft: 50, fontWeight: 'bold' }}>Valid Till: </Typography>
                                        <Typography style={{ paddingLeft: 10 }}>{moment(postData.validTill).format('DD MMM YYYY')}</Typography>
                                    </div> */}
                                                {/* <div style={{ flex: 1, flexDirection: 'row', display: 'flex', paddingTop: 5, paddingBottom: 5 }}>
                                        <Typography style={{ fontWeight: 'bold' }}>Gender: </Typography>
                                        <Paragraph style={{ paddingLeft: 10 }}>{postData.gender == 0 ? 'Male' : 'Female'}</Paragraph>
                                        <Paragraph style={{ marginLeft: 50, fontWeight: 'bold' }}>Age: </Paragraph>
                                        <Paragraph style={{ paddingLeft: 10 }}>{postData.ageFrom} - {postData.ageTo}</Paragraph>
                                    </div> */}
                                                {/* <div style={{ flex: 1, flexDirection: 'row', display: 'flex', paddingTop: 5, paddingBottom: 5 }}>
                                        <Typography style={{ fontWeight: 'bold' }}>City: </Typography>
                                        <div style={{ flex: 0.4, flexDirection: 'row', display: 'flex' }}>
                                            {postData.city !== "" && postData.city.length > 0 ?
                                                postData.city.map((el, index) => {
                                                    return (
                                                        <Paragraph style={{ marginLeft: 5 }}>{el.city}{postData.city.length > 1 && postData.city.length - 1 != index ? ',' : null}</Paragraph>
                                                    )
                                                })
                                                :
                                                <Paragraph> -- </Paragraph>
                                            }
                                        </div>

                                        <Typography style={{ marginLeft: 100, fontWeight: 'bold' }}>State: </Typography>
                                        <div style={{ flex: 0.4, flexDirection: 'row', display: 'flex' }}>
                                            {postData.state !== "" && postData.state.length > 0 ?
                                                postData.state.map((el, index) => {
                                                    return (
                                                        <Typography style={{ marginLeft: 5 }}>{el.state}{postData.state.length > 1 && postData.state.length - 1 != index ? ',' : null}</Typography>
                                                    )
                                                })
                                                :
                                                <Typography> -- </Typography>
                                            }
                                        </div>
                                    </div> */}

                                                {/* <div style={{ flex: 1, flexDirection: 'row', display: 'flex', paddingTop: 5, paddingBottom: 5 }}>
                                        <Typography style={{ fontWeight: 'bold' }}>Language: </Typography>
                                        <div style={{ flex: 1, flexDirection: 'row', display: 'flex' }}>
                                            {postData.language !== "" && postData.language.length > 0 ?
                                                postData.language.map((el, index) => {
                                                    return (
                                                        <Typography style={{ marginLeft: 5 }}>{el.languageName}{postData.language.length > 1 && postData.language.length - 1 != index ? ',' : null}</Typography>
                                                    )
                                                })
                                                :
                                                <Typography> -- </Typography>
                                            }
                                        </div>

                                    </div> */}
                                            </div>
                                        </div>

                                    </SimpleCard>
                                    :
                                    <SimpleCard>
                                        <Typography style={{ marginBottom: 10, marginTop: 10, textAlign: 'center', fontSize: 16 }}>Server error in fetching post detail</Typography>
                                    </SimpleCard>
                                }
                                <SimpleCard>
                                    <PaginationTable
                                        columns={columns}
                                        location="postDetailScreen"
                                        users={allUsers}
                                    />
                                </SimpleCard>
                            </Stack>

                            {
                                openStageDialog &&
                                <Dialog
                                    open={openStageDialog}
                                    fullWidth={true}
                                    maxWidth={'md'}
                                    onClose={handleCloseDialog}
                                    aria-labelledby="max-width-dialog-title"
                                >
                                    <DialogTitle id="max-width-dialog-title" textAlign='center' marginBottom={2}>{selectedRowData.firstName + " " + selectedRowData.lastName}</DialogTitle>

                                    <DialogContent>
                                        {/* <div>
                                            <p>Name: {selectedRowData.firstName + " " + selectedRowData.lastName} </p>
                                        </div> */}
                                        <DialogContentText>
                                            {/* By changing the stage will change the current stage level to the selected stage. */}
                                            Current Stage: {stagesListData[selectedRowData.stage - 1].label}
                                        </DialogContentText>
                                        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 20, marginTop: 10 }}>

                                            <div style={{ flex: 0.4, paddingRight: 10 }}>
                                                <Autocomplete
                                                    options={stagesListData}
                                                    getOptionLabel={(option) => option.label}
                                                    // onChange={(option) => selectedOption(option)}
                                                    renderInput={(params) => (
                                                        <TextField {...params} label="Select Stage" variant="outlined" fullWidth />
                                                    )}
                                                />
                                            </div>
                                            <div style={{ flex: 0.4 }}>
                                                <Autocomplete
                                                    options={stageStatus}
                                                    getOptionLabel={(option) => option.label}
                                                    // onChange={(option) => selectedOption(option)}
                                                    renderInput={(params) => (
                                                        <TextField {...params} label="Select Status" variant="outlined" fullWidth />
                                                    )}
                                                />
                                            </div>

                                        </div>
                                        <div style={{ width: '100%' }}>
                                            {/* <Typography>Current Stage: {stagesListData[selectedRowData.stage - 1].label}</Typography> */}
                                            {/* <Typography>Description: {stagesListData[selectedRowData.stage].label}</Typography> */}
                                            <TextField
                                                margin="dense"
                                                id="name"
                                                label="Remark"
                                                type="text"
                                                multiline={true}
                                                placeholder={"Enter remark"}
                                                maxlength="200"
                                                rows={2}
                                                style={{ width: '80%', marginTop: 0 }}
                                            />
                                        </div>

                                        <div style={{ marginTop: 10, marginBottom: 10 }}>
                                            <DataTable
                                                columns={stageHistoryColumns}
                                                data={allUsers}
                                                // selectableRowsComponentProps={selectProps}
                                                // onSelectedRowsChange={handleRowSelected}
                                                highlightOnHover
                                                // dense
                                                pagination
                                                responsive
                                            // progressPending={''}
                                            // customStyles={customStyles}
                                            // onRowClicked={rowClicked}
                                            />
                                        </div>
                                    </DialogContent>

                                    <DialogActions style={{ borderTop: '1px solid grey' }}>
                                        <Button onClick={() => handleViewprofileBtn(selectedRowData)} color="primary" variant="contained" style={{ marginRight: 40 }} >
                                            View Profile
                                        </Button>
                                        <Button onClick={handleCloseDialog} color="primary" variant="contained" style={{ marginRight: 40 }} >
                                            Submit
                                        </Button>
                                        <Button onClick={handleCloseDialog} color="primary" variant="outlined" >
                                            Close
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            }
                        </>
                }
            </div>
        </Container>
    );
}

export default DetailPost;