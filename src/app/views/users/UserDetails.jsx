
import { endPointName } from 'apis/apiList';
import { CallAPI } from 'apis/callAPI';
import React, { useEffect, useState } from 'react';
import Loading from 'app/components/MatxLoading';
// import { Autocomplete, Button, Grid, Stack, TextField } from '@mui/material';
// import { SimpleCard } from 'app/components';
// import PaginationTable from '../material-kit/tables/PaginationTable';
// import { CallAPI } from 'apis/callAPI';
// import { endPointName } from 'apis/apiList';
// import Loading from 'app/components/MatxLoading';
import { Cloud_Logo, Fb_Logo, Twitter_Logo, YT_Logo, Insta_Logo, IMDb_Logo, Audition_Icon, Default_Logo } from '../../../images';
import { Breadcrumb, PostTableLayout, SimpleCard } from 'app/components';
import {
    Box,
    Card,
    Divider,
    Grid,
    Icon,
    IconButton,
    Stack,
    Button,
    Typography,
    styled,
    TextField,
    Autocomplete,
    DialogTitle,
    DialogContentText,
    Dialog,
    DialogActions,
    DialogContent
} from '@mui/material';
// import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import { BiError } from 'react-icons/bi'
// import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
// import styled from 'styled-components';
import moment from 'moment';
import ModalView from 'app/components/ModalView';
import { cmToFeetInches } from 'utils/utilities';
import { TabList } from '@mui/lab';
import { useLocation, useNavigate } from 'react-router-dom';
import { stagesListData, stageStatus } from 'app/constant';
import { catchError } from 'app/firebase/Crashlytics';

const CardTitle = styled('div')(({ subtitle }) => ({
    fontSize: '1rem',
    fontWeight: '500',
    textTransform: 'capitalize',
    marginBottom: '10px',
    // backgroundColor: '#ea384d',
}));

const CardRoot = styled(Card)(() => ({
    height: '100%',
    // padding: '20px 24px',
}));

const StyledButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(1),
}));

const UserDetails = () => {

    const [allDetails, setAllDetails] = useState(null);
    const [postDetails, setPostDetails] = useState(null);
    const [show, setShow] = useState(false);
    const [img, setImg] = useState();
    const [singlePostData, setSinglePostData] = useState()
    const [openUpadteModal, setOpenUpadteModal] = useState(false);
    const [openStageDialog, setOpenStageDialog] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [selectedRowData, setselectedRowData] = useState();

    const [value, setValue] = React.useState('1');
    const [galleryImg, setGalleryImg] = useState([]);
    const navigate = useNavigate();

    const columns = [
        {
            id: 'postid',
            name: 'Id',
            // center: true,
            width: '5%',
            selector: row => row.postId,
            sortable: true

        },
        {
            id: 'title',
            name: 'Title',
            selector: row => row.title,
            sortable: true,
            wrap: true,
            width: '22%'
        },
        // {
        //     id: 'description',
        //     name: 'Description',
        //     selector: row => row.description,
        //     wrap: true,
        //     width: '20%'
        // },
        {
            id: 'publishon',
            name: 'Publish On',
            selector: row => {
                // let d = new Date(row.publishOn);
                // return d.toISOString().substring(0, 10)
                return moment(row.publishOn).format('DD MMM YYYY')
            },
            sortable: true,
            center: true,
            width: '8%'
        },
        {
            id: 'validtill',
            name: 'Valid Till',
            selector: row => moment(row.validTill).format('DD MMM YYYY'),
            sortable: true,
            width: '8%'
        },
        {
            id: 'appliedOn',
            name: 'Applied On',
            selector: row => moment(row.appliedOn).format('DD MMM YYYY'),
            sortable: true,
            width: '8%'
        },
        {
            name: 'Stage',
            selector: row => {
                return (
                    <StyledButton variant="outlined" color="primary" style={{ height: '30px' }} onClick={() => handleClickOpenDialog(row)}>
                        {row.stage}
                    </StyledButton>
                )
            },
            sortable: true,
            width: '9%'
        },
        {
            id: 'status',
            name: 'Status',
            selector: row => row.applicationStatus,
            wrap: true,
            width: '16%'
        },
        {
            id: 'remarks',
            name: 'Remark',
            selector: row => row.remark,
            wrap: true,
            // sortable: true,
            width: '18%'
        },
        {
            id: 'action',
            name: 'Action',
            selector: row => {
                return (
                    <>
                        <IconButton color="primary" className="button" aria-label="View" onClick={() => onClickView(row)}>
                            <Icon>remove_red_eye</Icon>
                        </IconButton>
                        {/* <StyledButton style={{ padding: 0 }} variant="outlined" onClick={() => onClickEdit(row)}>Edit</StyledButton> */}
                    </>
                )
            },
            button: true,
            width: '5%'
        }
    ];

    const handleClickOpenDialog = (data) => {
        try {
            setOpenStageDialog(true);
            setselectedRowData(data)
        } catch (error) {
            catchError(error, 'UserDetails_1');
        }
    }


    const onClickView = (row) => {
        try {
            setOpenUpadteModal(false);
            // setOpenViewModal(true);
            setSinglePostData(row);
            navigate('/post/DetailPost', { state: { postData: row, location: 'UserDetails' } });
        } catch (error) {
            catchError(error, 'UserDetails_2');
        }
    }

    const handleChange = (event, newValue) => {
        try {
            setValue(newValue);
        } catch (error) {
            catchError(error, 'UserDetails_3');
        }
    };

    const handleClose = () => {
        try {
            setShow(false)
            setImg('');
        } catch (error) {
            catchError(error, 'UserDetails_4');
        }
    };
    const handleShow = (imgData) => {
        try {
            setShow(true)
            setImg(imgData);
        } catch (error) {
            catchError(error, 'UserDetails_5');
        }
    };

    function handleCloseDialog() {
        try {
            setOpenStageDialog(false);
        } catch (error) {
            catchError(error, 'UserDetails_6');
        }
    }

    const getUserDetails = async () => {
        try {
            const payload = {
                UserId: window.userId
                // UserId: 1128
            }
            let response = await CallAPI(endPointName.SingleUserDetails + window.userId, "post");
            if (response !== 'error') {
                // let response = await CallAPI(endPointName.SingleUserDetails + "1128", "post");     //--- For All Details Test User Ajinkya
                // let response = await CallAPI(endPointName.SingleUserDetails + "10423", "post");   //--- For All Details Test User
                let postResponse = await CallAPI(endPointName.adminGetPostsAppliedByUserId, "POST", payload);
                setPostDetails(postResponse);
                setAllDetails(response);
                let tempImages = [
                    { galleryId: 0, imageURL: '' },
                    { galleryId: 0, imageURL: '' },
                    { galleryId: 0, imageURL: '' },
                    { galleryId: 0, imageURL: '' }
                ];
                for (let i = 0; i < response.listUserImageGallery.length; i++) {
                    tempImages[i].imageURL = response.listUserImageGallery[i].imageURL;
                }
                setGalleryImg(tempImages);
            } else {
                setOpenAlert(true)
            }
        } catch (error) {
            catchError(error, 'UserDetails_7');
        }
    }

    const handleCloseAlert = () => {
        setOpenAlert(false)
        window.close();
    }

    useEffect(() => {
        getUserDetails()
    }, [allDetails !== undefined])

    return (
        <div style={{ margin: 10 }}>
            {
                allDetails === null ?
                    <>
                        <Loading />
                        {openAlert == true && <Dialog open={openAlert} onClose={handleCloseAlert}>
                            <DialogTitle>Error!<BiError size={22} color={'red'} style={{ marginBottom: 5 }} /></DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Server Error
                                </DialogContentText>

                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseAlert}>Ok</Button>
                            </DialogActions>
                        </Dialog>}
                    </>
                    :
                    <>
                        <Box className="breadcrumb" style={{ marginLeft: 10, marginTop: 20 }}>
                            <Breadcrumb
                                routeSegments={[{ name: 'User Details' }]}
                            />
                        </Box>
                        <Box sx={{ width: '100%', typography: 'body1' }}>
                            <TabContext value={value}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                                        <Tab label="User Details" value="1" />
                                        <Tab label="Post Applied" value="2" />
                                    </TabList>
                                </Box>
                                <TabPanel value="1">
                                    <Stack spacing={2}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={3} style={{ height: '0%' }}>

                                                <CardRoot elevation={6}>
                                                    <div>
                                                        <CardTitle style={{ textAlign: 'center', paddingTop: 8, fontSize: 13 }}>Applied on - {(postDetails !== null && postDetails !== undefined) && postDetails.length}</CardTitle>
                                                    </div>
                                                    {(allDetails.singleUserData.coverImage !== null && allDetails.singleUserData.coverImage !== '' && allDetails.singleUserData.coverImage !== undefined) ?

                                                        <a onClick={() => handleShow(allDetails.singleUserData.coverImage)} >

                                                            <img src={allDetails.singleUserData.coverImage} style={{ height: '50%', width: '100%' }} />
                                                        </a>
                                                        :
                                                        <a>

                                                            <img src={Default_Logo} style={{ height: '50%', width: '100%' }} />
                                                        </a>

                                                    }
                                                    {(allDetails.singleUserData.profileImage != undefined && allDetails.singleUserData.profileImage !== null && allDetails.singleUserData.profileImage !== '')
                                                        ?
                                                        <div style={{ textAlign: 'center', marginTop: -40 }}>
                                                            <a onClick={() => handleShow(allDetails.singleUserData.profileImage)}>
                                                                <img className="img-circle" src={allDetails.singleUserData.profileImage} style={{ height: '80px', width: '80px', borderRadius: 40 }} />
                                                            </a>
                                                        </div>
                                                        :
                                                        <div style={{ textAlign: 'center', marginTop: -40 }}>
                                                            <a>
                                                                <img className="img-circle" src={Default_Logo} style={{ height: '80px', width: '80px', borderRadius: 40 }} />
                                                            </a>
                                                        </div>
                                                    }

                                                    <CardTitle style={{ textAlign: 'center', fontSize: 18, paddingTop: 10 }}>{allDetails.singleUserData.firstName} {allDetails.singleUserData.lastName} ({allDetails.singleUserData.userId})</CardTitle>
                                                    {(allDetails.singleUserData.mobileNumber !== '' && allDetails.singleUserData.mobileNumber !== undefined && allDetails.singleUserData.mobileNumber !== null) ?
                                                        <Typography style={{ textAlign: 'center' }}>
                                                            {allDetails.singleUserData.mobileNumber}
                                                        </Typography> :
                                                        <Typography style={{ textAlign: 'center' }}>
                                                            -
                                                        </Typography>

                                                    }
                                                    {allDetails.singleUserData.emailId !== null ?
                                                        <Typography style={{ textAlign: 'center' }}>
                                                            {allDetails.singleUserData.emailId}
                                                        </Typography>
                                                        :
                                                        <Typography style={{ textAlign: 'center' }}>
                                                            -
                                                        </Typography>
                                                    }
                                                    <CardTitle style={{ textAlign: 'center', fontSize: 14, fontStyle: 'italic' }}>{allDetails.listUserAddressData[0].city} - {allDetails.singleUserData.age} y.o</CardTitle>
                                                    <div style={{ textAlign: 'center' }}>
                                                        {(allDetails.singleUserData.facebookURL !== '' && allDetails.singleUserData.facebookURL !== null) &&
                                                            <a target="_blank" href={"https://www.facebook.com/" + allDetails.singleUserData.facebookURL}>
                                                                <img className="ml-1 mr-2" style={{ width: '9%' }} src={Fb_Logo} />
                                                            </a>
                                                        }
                                                        {
                                                            (allDetails.singleUserData.instagramId !== '' && allDetails.singleUserData.instagramId !== null) &&
                                                            <a target="_blank" href={"https://www.instagram.com/" + allDetails.singleUserData.instagramId}>
                                                                <img className="ml-1 mr-2" style={{ width: '9%', marginLeft: 10 }} src={Insta_Logo} />
                                                            </a>

                                                        }
                                                        {
                                                            (allDetails.singleUserData.twitterURL !== '' && allDetails.singleUserData.twitterURL !== null) &&
                                                            <a target="_blank" href={"https://www.twitter.com/" + allDetails.singleUserData.twitterURL}>
                                                                <img className="ml-1 mr-2" style={{ width: '10%', marginLeft: 10 }} src={Twitter_Logo} />
                                                            </a>
                                                        }
                                                        {
                                                            (allDetails.singleUserData.youtubeId !== '' && allDetails.singleUserData.youtubeId !== null) &&
                                                            <a target="_blank" href={"https://www.youtube.com/" + allDetails.singleUserData.youtubeId}>
                                                                <img className="ml-1 mr-2" style={{ width: '10%', marginLeft: 10 }} src={YT_Logo} />
                                                            </a>
                                                        }
                                                        {(allDetails.singleUserData.imdbProfile !== '' && allDetails.singleUserData.imdbProfile !== null) &&
                                                            <a target="_blank" href={allDetails.singleUserData.imdbProfile}>
                                                                <img className="ml-1 mr-2" style={{ width: '9%', marginLeft: 10 }} src={IMDb_Logo} />
                                                            </a>
                                                        }
                                                        {(allDetails.singleUserData.otherProfile !== '' && allDetails.singleUserData.otherProfile !== null) &&
                                                            <a target="_blank" href={allDetails.singleUserData.otherProfile}>
                                                                <img className="ml-1 mr-2" style={{ width: '9%', marginLeft: 10 }} src={Cloud_Logo} />
                                                            </a>
                                                        }
                                                        {(allDetails.singleUserData.monologueLink !== '' && allDetails.singleUserData.monologueLink !== null) &&
                                                            <a target="_blank" href={allDetails.singleUserData.monologueLink}>
                                                                <img className="ml-1 mr-1" style={{ width: '11%', marginLeft: 10 }} src={Audition_Icon} />
                                                            </a>
                                                        }
                                                    </div>
                                                    <div style={{ padding: 10 }}>
                                                        <Divider style={{ backgroundColor: 'black' }} />
                                                    </div>

                                                    {(allDetails.singleUserData.biography !== '' && allDetails.singleUserData.biography !== undefined && allDetails.singleUserData.biography !== null) ?

                                                        <Typography style={{ padding: 15, textAlign: 'center' }}>
                                                            {allDetails.singleUserData.biography}
                                                        </Typography>
                                                        :
                                                        <Typography style={{ padding: 15, textAlign: 'center' }}>
                                                            -
                                                        </Typography>

                                                    }
                                                    <div style={{ textAlign: 'center', paddingBottom: 15 }}>

                                                        {(allDetails.singleUserData.introVideo !== '' && allDetails.singleUserData.introVideo !== undefined && allDetails.singleUserData.introVideo !== null) &&
                                                            <a variant="contained" target="_blank" href={allDetails.singleUserData.introVideo} className="btn btn-primary btn-block" style={{ width: '20%' }}><b>Intro</b></a>
                                                        }
                                                    </div>
                                                </CardRoot>

                                            </Grid>
                                            <Grid item xs={9} >

                                                <CardRoot elevation={6} style={{ padding: '10px' }}>
                                                    <Typography style={{ paddingBottom: 9 }}>{allDetails.listUserImageGallery !== null && allDetails.listUserImageGallery.length} Photos</Typography>
                                                    <div className="filter-container p-0 row">


                                                        {galleryImg !== null && galleryImg.map((el, index) => {
                                                            return (
                                                                <div key={index} className="filtr-item col" data-category="" data-sort="white sample">
                                                                    {
                                                                        el.imageURL == '' ?
                                                                            <img src={Default_Logo} className="img-fluid mb-2" alt="white sample" />
                                                                            :
                                                                            <a onClick={() => { handleShow(el.imageURL) }}>
                                                                                <img src={el.imageURL} className="img-fluid mb-2" alt="white sample" />
                                                                            </a>
                                                                    }
                                                                </div>
                                                            )
                                                        })}
                                                        {/* {allDetails.listUserImageGallery.map((el, index) => {
                                                        return (
                                                            <div key={index} className="filtr-item row" data-category="" data-sort="white sample">
                                                                <a href={el.imageURL} data-toggle="lightbox" data-title="">
                                                                    <img src={el.imageURL} className="img-fluid mb-2" alt="white sample" style={{ width: "20%" }} />
                                                                </a>
                                                            </div>
                                                        )
                                                    })} */}
                                                        {/* <div className="filter-container p-0 row" data-category="" data-sort="white sample">
                                                        <a href={allDetails.listUserImageGallery[0].imageUrl} data-toggle="lightbox" data-title="">
                                                            <img src={allDetails.listUserImageGallery[0].imageURL} className="img-fluid mb-2" alt="white sample" style={{ width: "20%" }} />
                                                        </a>
                                                    </div> */}
                                                    </div>
                                                    <div style={{ paddingTop: 20, paddingBottom: 20 }}>
                                                        <Divider style={{ backgroundColor: 'black' }} />
                                                    </div>
                                                    <Stack direction={'row'}>
                                                        <Stack style={{ paddingRight: 40 }}>
                                                            {allDetails.singleUserData.gender !== null && allDetails.singleUserData.gender == 1 ?
                                                                <Typography style={{ fontWeight: 'bold' }}>Female</Typography>
                                                                :
                                                                <Typography style={{ fontWeight: 'bold' }}>Male</Typography>
                                                            }
                                                            <Typography>Gender</Typography>
                                                        </Stack>
                                                        <Stack style={{ paddingRight: 40 }}>
                                                            {
                                                                (allDetails.singleUserData.dob !== '' && allDetails.singleUserData.dob !== undefined && allDetails.singleUserData.dob !== null) ?
                                                                    <Typography style={{ fontWeight: 'bold' }}>
                                                                        {moment(allDetails.singleUserData.dob).format('DD MMM YYYY')}
                                                                    </Typography>
                                                                    :
                                                                    <Typography style={{ fontWeight: 'bold' }}>
                                                                        -
                                                                    </Typography>
                                                            }
                                                            <Typography>Date of birth</Typography>
                                                        </Stack>
                                                        <Stack style={{ paddingRight: 40 }}>
                                                            {(allDetails.singleUserData.height !== '' && allDetails.singleUserData.height !== undefined && allDetails.singleUserData.height !== null) ?
                                                                <Typography style={{ fontWeight: 'bold' }}>{cmToFeetInches(allDetails.singleUserData.height)}</Typography> :

                                                                <Typography style={{ fontWeight: 'bold' }}>
                                                                    -
                                                                </Typography>
                                                            }
                                                            <Typography>Height</Typography>
                                                        </Stack>
                                                        <Stack style={{ paddingRight: 30 }}>
                                                            {(allDetails.singleUserData.weight !== '' && allDetails.singleUserData.weight !== undefined && allDetails.singleUserData.weight !== null) ?
                                                                <Typography style={{ fontWeight: 'bold' }}>{allDetails.singleUserData.weight} Kg</Typography> :
                                                                <Typography style={{ fontWeight: 'bold' }}>
                                                                    -
                                                                </Typography>

                                                            }
                                                            <Typography>Weight</Typography>
                                                        </Stack>
                                                        <Stack style={{ paddingRight: 40 }}>
                                                            {(allDetails.singleUserData.fatherName !== '' && allDetails.singleUserData.fatherName !== undefined && allDetails.singleUserData.fatherName !== null) ?
                                                                <Typography style={{ fontWeight: 'bold' }}>
                                                                    {allDetails.singleUserData.fatherName}
                                                                </Typography> :
                                                                <Typography style={{ fontWeight: 'bold' }}>
                                                                    -
                                                                </Typography>
                                                            }
                                                            <Typography>Middle Name</Typography>
                                                        </Stack>
                                                        <Stack style={{ paddingRight: 40 }}>

                                                            <Stack direction={"row"} style={{ paddingRight: 30 }}>
                                                                {allDetails.listUserLanguageData !== null &&
                                                                    allDetails.listUserLanguageData.map((el, index) => {
                                                                        return (
                                                                            <Stack direction={'row'}>
                                                                                <div key={index}>
                                                                                    {(el.languageName !== null && el.languageName !== '') ?

                                                                                        <Typography style={{ fontWeight: 'bold', marginRight: 5 }}>{el.languageName}{allDetails.listUserLanguageData.length - 1 && allDetails.listUserLanguageData.length - 1 != index ? ', ' : null}</Typography>
                                                                                        :
                                                                                        <Typography style={{ fontWeight: 'bold' }}>
                                                                                            -
                                                                                        </Typography>
                                                                                    }
                                                                                </div>
                                                                            </Stack>
                                                                        )
                                                                    })
                                                                }
                                                            </Stack>
                                                            <Stack>
                                                                <Typography>Language Fluency</Typography>
                                                            </Stack>
                                                        </Stack>
                                                    </Stack>
                                                    <Stack style={{ paddingTop: 20 }}>
                                                    </Stack>
                                                </CardRoot>
                                            </Grid>
                                            <Grid item xs={3} >
                                                <CardRoot elevation={6}>

                                                    <CardTitle style={{ fontSize: 16, paddingTop: 10, paddingLeft: 10 }}>Current Address</CardTitle>
                                                    <div style={{ paddingBottom: 10 }}>
                                                        <Divider style={{ backgroundColor: 'black' }} />
                                                    </div>
                                                    {
                                                        (allDetails.listUserAddressData !== undefined && allDetails.listUserAddressData !== null && allDetails.listUserAddressData !== '') &&
                                                        <Typography style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 10, color: 'grey' }}>
                                                            {allDetails.listUserAddressData[0].address1} {allDetails.listUserAddressData[0].address2 == '' ? '' : ','} {allDetails.listUserAddressData[0].address2}
                                                        </Typography>
                                                    }
                                                    <Typography style={{ paddingLeft: 10, paddingBottom: 10 }}> {allDetails.listUserAddressData[0].city} - {allDetails.listUserAddressData[0].postalCode !== '' && allDetails.listUserAddressData[0].postalCode}, {allDetails.listUserAddressData[0].state}, {allDetails.listUserAddressData[0].countryId === 1 && 'India'}</Typography>


                                                    <Divider style={{ backgroundColor: 'black' }} />
                                                    <CardTitle style={{ fontSize: 16, paddingTop: 10, paddingLeft: 10, marginBottom: 0 }}>Permanent Address</CardTitle>
                                                    <div style={{ marginTop: "8px" }}>

                                                        <Divider style={{ backgroundColor: 'black' }} />
                                                    </div>
                                                    {
                                                        (allDetails.listUserAddressData !== undefined && allDetails.listUserAddressData !== null && allDetails.listUserAddressData !== '') &&
                                                        <Typography style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 10, color: 'grey' }}>
                                                            {allDetails.listUserAddressData[0].address1} {allDetails.listUserAddressData[0].address2 == '' ? '' : ','} {allDetails.listUserAddressData[0].address2}
                                                        </Typography>
                                                    }
                                                    <Typography style={{ paddingLeft: 10, paddingBottom: 10 }}> {allDetails.listUserAddressData[0].city} - {allDetails.listUserAddressData[0].postalCode !== '' && allDetails.listUserAddressData[0].postalCode}, {allDetails.listUserAddressData[0].state}, {allDetails.listUserAddressData[0].countryId === 1 && 'India'}</Typography>

                                                </CardRoot>
                                            </Grid>
                                            <Grid item xs={9} >
                                                <CardRoot elevation={6} style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 10 }}>
                                                    <CardTitle style={{ fontSize: 16, paddingTop: 10 }}>Work Experience</CardTitle>
                                                    <div style={{ paddingBottom: 10 }}>

                                                        <Divider style={{ backgroundColor: 'black' }} />
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                                        {allDetails.listWorkExpURL !== null ?

                                                            allDetails.listWorkExpURL.map((el, index) => {
                                                                return (
                                                                    <div className="row" key={index} style={{ paddingTop: 10, width: '25%', marginRight: 10, paddingLeft: 10 }}>
                                                                        <SimpleCard>
                                                                            <Typography style={{ fontWeight: 'bold' }}>{el.workExpCategoryName}</Typography>
                                                                            <Typography>
                                                                                {el.videoTitle}
                                                                            </Typography>
                                                                            <Typography>
                                                                                <a href={el.videoURL} target="_blank">{el.videoURL}</a>
                                                                            </Typography>
                                                                        </SimpleCard>
                                                                    </div>
                                                                )
                                                            })
                                                            :
                                                            <Typography style={{ fontWeight: 'bold', paddingBottom: 10 }}>
                                                                No record exist
                                                            </Typography>
                                                        }

                                                    </div>
                                                </CardRoot>
                                            </Grid>
                                            <Grid item xs={3} >
                                                {/* <CardRoot elevation={6}>
                                    <CardTitle style={{ fontSize: 18, paddingTop: 10 }}>Work Experience</CardTitle>

                                </CardRoot> */}
                                            </Grid>
                                            <Grid item xs={9} >
                                                <CardRoot elevation={6} style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 10 }}>
                                                    <CardTitle style={{ fontSize: 16, paddingTop: 10 }}>Education Data</CardTitle>
                                                    <div style={{ paddingBottom: 10 }}>

                                                        <Divider style={{ backgroundColor: 'black' }} />
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                                        {allDetails.listUserEducationData !== null ?

                                                            allDetails.listUserEducationData.map((el, index) => {
                                                                return (
                                                                    <div key={index} style={{ paddingTop: 10, width: "49%" }}>
                                                                        <SimpleCard style={{ paddingBottom: 10 }}>

                                                                            <Typography style={{ fontWeight: 'bold' }}>
                                                                                {el.schoolName}
                                                                            </Typography>
                                                                            <Typography>{el.qualificationName}</Typography>

                                                                            {el.passingYear !== null ?
                                                                                <Typography>
                                                                                    {el.passingYear}
                                                                                </Typography>
                                                                                :
                                                                                <p>-</p>

                                                                            }
                                                                            <Typography>
                                                                                {el.course}
                                                                            </Typography>
                                                                        </SimpleCard>
                                                                    </div>
                                                                )
                                                            })
                                                            :
                                                            <Typography style={{ fontWeight: 'bold', paddingBottom: 10 }}>
                                                                No record exist
                                                            </Typography>
                                                        }

                                                    </div>
                                                </CardRoot>
                                            </Grid>

                                        </Grid>
                                        {show == true && <ModalView show={show} handleClose={handleClose} imgUrl={img} />}
                                    </Stack>
                                </TabPanel>
                                <TabPanel value="2">
                                    <PostTableLayout
                                        columns={columns}
                                        posts={postDetails}
                                    />
                                    {
                                        openStageDialog &&
                                        <Dialog
                                            open={openStageDialog}
                                            fullWidth={true}
                                            maxWidth={'md'}
                                            onClose={handleCloseDialog}
                                            aria-labelledby="max-width-dialog-title"
                                        >
                                            <DialogTitle id="max-width-dialog-title">Change stage</DialogTitle>

                                            <DialogContent>
                                                <div>
                                                    <p>Name: {allDetails.singleUserData.firstName + " " + allDetails.singleUserData.lastName} </p>
                                                </div>
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
                                                        rows={3}
                                                        style={{ width: '70%', marginTop: 0 }}
                                                    />
                                                </div>

                                            </DialogContent>

                                            <DialogActions style={{ borderTop: '1px solid grey' }}>
                                                <Button onClick={handleCloseDialog} color="primary" variant="contained" style={{ marginRight: 40 }} >
                                                    Submit
                                                </Button>
                                                <Button onClick={handleCloseDialog} color="primary" variant="outlined" >
                                                    Close
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                    }
                                </TabPanel>
                            </TabContext>

                        </Box>
                    </>

            }
        </div >
    );
}

export default UserDetails;
