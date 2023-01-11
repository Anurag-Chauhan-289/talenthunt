
import React, { useCallback, useEffect, useState } from 'react';
import { Autocomplete, Box, Button, Grid, Stack, styled, TextField } from '@mui/material';
import { Breadcrumb, SimpleCard } from 'app/components';
import PaginationTable from '../material-kit/tables/PaginationTable';
import { CallAPI } from 'apis/callAPI';
import { endPointName } from 'apis/apiList';
import Loading from 'app/components/MatxLoading';
import NotificationPopUp from '../material-kit/dialog/Notification';

import { CgProfile } from 'react-icons/cg';
import { Cloud_Logo, Audition_Icon, Email_Logo, Whatsapp_Logo, Twitter_Logo, Fb_Logo, IMDb_Logo, YT_Logo, Insta_Logo } from '../../../images';
import { cmToFeetInches } from "utils/utilities";
import { facebookURL, gmailURL, instagramURL, stagesListData, twitterURL, whatsAppURL, youtubeURL } from "app/constant";
import { SocialMediaLayout } from "app/components";
import moment from "moment";

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

const UserList = () => {
    const [States, setStates] = useState("");
    // const [allStatesCity, setAllStatesCity] = useState([]);
    // const [citiesWithStateSelected, setCitiesWithStateSelected] = useState([]);
    const [cities, setCities] = useState("");
    const [userGenderValue, setUserGenderValue] = useState([]);
    const [UserLanguageValue, setUserLanguageValue] = useState([]);
    const [languagesList, setLanguagesList] = useState([]);
    const [UserCityValue, setUserCityValue] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [userStateValue, setUserStateValue] = useState([]);
    const [ageFrom, setAgeFrom] = React.useState("");
    const [ageTo, setAgeTo] = React.useState("");
    const [openNotifcation, setOpenNotification] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([])
    const [isAllSelected, setIsAllSelected] = useState(false)

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
            width: '17%',
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
            width: '9%',
        },
        {
            name: 'Connect',
            selector: row => {
                return ([row.mobileNumber !== '' && row.mobileNumber !== null && row.mobileNumber !== undefined ?
                    <SocialMediaLayout
                        key={row.userId + '_mobile'}
                        url={whatsAppURL + row.mobileNumber}
                        icon={Whatsapp_Logo}
                        iconStyle={{ width: '32px', height: '32px' }}
                    />
                    : '',
                row.emailId !== '' && row.emailId !== null && row.emailId !== undefined ?
                    <SocialMediaLayout
                        key={row.userId + '_email'}
                        url={gmailURL + row.emailId}
                        // children={<SiGmail size={30} color='blue' />}
                        icon={Email_Logo}
                        children={<img className="ml-1 mr-2" style={{ width: '40px', height: '40px', marginLeft: 7 }} src={Email_Logo} />}
                        iconStyle={{ width: '24px', height: '18px' }}
                    />
                    : ''
                ])
            },
            width: '9%'
        },
        {
            name: 'Social',
            selector: row => {
                return ([
                    row.facebookURL !== '' && row.facebookURL !== null && row.facebookURL !== undefined ? <SocialMediaLayout key={row.userId + '_facebook'} url={facebookURL + row.facebookURL} icon={Fb_Logo} iconStyle={{ width: '28px', height: '28px' }} /> : '',
                    row.instagramId !== '' && row.instagramId !== null && row.instagramId !== undefined ? <SocialMediaLayout key={row.userId + '_insta'} url={instagramURL + row.instagramId} icon={Insta_Logo} iconStyle={{ width: '28px', height: '28px', marginLeft: 7 }} /> : '',
                    row.twitterURL !== '' && row.twitterURL !== null && row.twitterURL !== undefined ? <SocialMediaLayout key={row.userId + '_twitter'} url={twitterURL + row.twitterURL} icon={Twitter_Logo} iconStyle={{ width: '32px', height: '32px', marginLeft: 7 }} /> : '',
                    row.youTubeId !== '' && row.youTubeId !== null && row.youTubeId !== undefined ? <SocialMediaLayout key={row.userId + '_ytd'} url={youtubeURL + row.youTubeId} icon={YT_Logo} iconStyle={{ width: '32px', height: '34px', marginLeft: 7 }} /> : '',
                    row.imdbProfile !== '' && row.imdbProfile !== null && row.imdbProfile !== undefined ? <SocialMediaLayout key={row.userId + '_imdb'} url={row.imdbProfile} icon={IMDb_Logo} iconStyle={{ width: '28px', height: '26px', marginLeft: 7 }} /> : '',
                    row.otherProfile !== '' && row.otherProfile !== null && row.otherProfile !== undefined ? <SocialMediaLayout key={row.userId + '_otherProfile'} url={row.otherProfile} icon={Cloud_Logo} iconStyle={{ width: '30px', height: '30px', marginLeft: 7 }} /> : '',
                    row.monologueLink !== '' && row.monologueLink !== null && row.monologueLink !== undefined ? <SocialMediaLayout key={row.userId + '_monolouge'} url={row.monologueLink} icon={Audition_Icon} iconStyle={{ width: '30px', height: '28px', marginLeft: 7 }} /> : ''
                ])
            },
            width: '23%'
        },
        {
            name: 'id',
            selector: row => row.userId,
            sortable: true,
            width: '5%',
        },
    ];

    const gender = [
        {
            label: 'Male',
            value: 0
        },
        {
            label: "Female",
            value: 1
        }
    ];

    const getStates = async () => {
        let response = await CallAPI(endPointName.state, "get");
        // let statesCities = response.cityStateModels;
        let onlyStates = response.cityStateModels.filter(el => el.stateId && el.isStateActive == true)
        // setAllStatesCity(statesCities);
        let temp = []
        for (let i = 0; i < onlyStates.length; i++) {
            if (temp.length == 0) {
                temp.push(onlyStates[i]);
            } else {
                let objState = temp.findIndex(el => el.stateId == onlyStates[i].stateId);
                if (objState == -1) {
                    temp.push(onlyStates[i]);
                }
            }
        }
        let temp1 = temp.map(el => ({ label: el.state, value: el.stateId }))
        setStates(temp1);
    }

    const getCities = async () => {
        let cities = await CallAPI(endPointName.CityData, "get");
        setCities(cities);
    }

    const getLanguages = async () => {
        let response = await CallAPI(endPointName.Language, "get");
        setLanguagesList(response);
    }

    const callUserListApi = async () => {
        const payload = {
            searchGender: userGenderValue.length > 0 ? userGenderValue : "",
            searchStates: userStateValue.length > 0 ? userStateValue : "",
            searchStartDate: ageFrom,
            searchEndDate: ageTo,
            searchLanguage: UserLanguageValue.length > 0 ? UserLanguageValue : "",
            searchCity: UserCityValue.length > 0 ? UserCityValue : "",
            OrganizationId: 1
        }
        let response = await CallAPI(endPointName.AllUserDataList, "Post", payload);
        setAllUsers(response);
    }

    useEffect(() => {
        // apiCallTable();
        callUserListApi();
        getStates();
        getCities();
        getLanguages();
    }, [])

    const onPressApply = () => {
        callUserListApi();
    }

    const onPressReset = () => {
        setUserGenderValue([]);
        setUserStateValue([]);
        setUserCityValue([]);
        setUserLanguageValue([]);
        setAgeFrom("");
        setAgeTo("")
    }

    const searchTextEvent = (event) => {
        setSearchText(event.target.value);
    }

    const handleRowSelected = useCallback(state => {
        setSelectedUsers(state.selectedRows);
        if (state.allSelected) {
            setIsAllSelected(true)
        } else {
            setIsAllSelected(false)
        }
        return state.selectedRows
    }, []);

    return (
        <Container>
            <Box className="breadcrumb">
                <Breadcrumb routeSegments={[{ name: 'Users List' }]} />
            </Box>
            <div style={{ margin: 10 }}>
                {
                    allUsers.length == 0 ?
                        <Loading />
                        :

                        <Stack spacing={3}>
                            <SimpleCard>
                                <Grid container spacing={6}>
                                    <Grid item xs={4}>
                                        <Autocomplete
                                            multiple
                                            id="tags-outlined"
                                            options={States}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    label="Select State"
                                                    placeholder="Select State"
                                                    fullWidth
                                                />
                                            )}
                                            value={userStateValue}
                                            style={{ marginBottom: 16 }}
                                            onChange={(_, newValue) => {
                                                setUserStateValue(newValue);
                                            }}
                                        />
                                        <Autocomplete
                                            multiple
                                            id="tags-outlined"
                                            options={gender}
                                            value={userGenderValue}
                                            getOptionLabel={(option) => option.label}
                                            // filterSelectedOptions
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    label="Select Gender"
                                                    placeholder="Select Gender"
                                                    fullWidth
                                                />
                                            )}
                                            onChange={(_, newValue) => {
                                                setUserGenderValue(newValue);
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Autocomplete
                                            multiple
                                            id="tags-outlined"
                                            options={cities}
                                            getOptionLabel={(option) => option.city}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    label="Select City"
                                                    placeholder="Select City"
                                                />
                                            )}
                                            style={{ marginBottom: 16 }}
                                            value={UserCityValue}
                                            onChange={(_, newValue) => {
                                                setUserCityValue(newValue);
                                            }}
                                        />
                                        <Stack spacing={2} direction="row">
                                            <TextField
                                                label="From Age"
                                                value={ageFrom}
                                                onChange={(event) => setAgeFrom(event.target.value)}
                                            />
                                            <p style={{ paddingTop: 15 }}>To</p>
                                            <TextField
                                                label="To Age"
                                                value={ageTo}
                                                onChange={(event) => setAgeTo(event.target.value)}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Autocomplete
                                            multiple
                                            id="tags-outlined"
                                            options={languagesList}
                                            getOptionLabel={(option) => option.languageName}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    label="Select Language"
                                                    placeholder="Select Language"
                                                    fullWidth
                                                />
                                            )}
                                            style={{ marginBottom: 16 }}
                                            value={UserLanguageValue}
                                            onChange={(_, newValue) => {
                                                setUserLanguageValue(newValue);
                                            }}
                                        />
                                        <Stack spacing={2} direction="row-reverse" style={{ paddingTop: 8, }}>
                                            <Button variant="outlined" onClick={onPressReset}>Reset</Button>
                                            <Button variant="contained" onClick={onPressApply}>Apply</Button>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </SimpleCard>
                            {/* <Button variant="outlined" onClick={() => setOpenNotification(true)}>
                            notification
                        </Button> */}

                            <NotificationPopUp
                                open={openNotifcation}
                                handleClose={() => setOpenNotification(false)}
                                isAllSelected={isAllSelected}
                                usersList={selectedUsers}
                            />
                            <SimpleCard>
                                <StyledButton variant="contained" color="primary" onClick={() => setOpenNotification(true)}>
                                    Notification
                                </StyledButton>
                                {/* <TextField
                                label="Search"
                                value={searchText}
                                onChange={(event) => searchTextEvent(event)}
                            /> */}
                                <PaginationTable
                                    columns={columns}
                                    users={allUsers}
                                    handleRowSelected={handleRowSelected}
                                />
                            </SimpleCard>
                        </Stack>
                }
            </div>
        </Container>
    );
}

export default UserList;
