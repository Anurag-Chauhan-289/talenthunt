import React, { useEffect, useState } from 'react';
import { SimpleCard } from 'app/components';
import { Autocomplete, Button, Checkbox, FormControlLabel, FormGroup, Grid, Icon, Snackbar, Stack, styled } from '@mui/material';
// import Loading from 'app/components/MatxLoading';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { endPointName } from 'apis/apiList';
import { CallAPI } from 'apis/callAPI';
// import { Description } from '@mui/icons-material';
import moment from 'moment/moment';
import MuiAlert from '@mui/material/Alert';
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { Span } from 'app/components/Typography';

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: 16,
}));

const CreatePost = () => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [fromAge, setAgeFrom] = useState("");
    const [toAge, setToAge] = useState("");
    const [snackOpen, setSnackOpen] = useState(false);
    const [PostId, setPostId] = useState(0);
    const [publishOn, setPublishOn] = useState(new Date());
    const [validTill, setvalidTill] = useState(null);
    const [cities, setCities] = useState("");
    const [States, setStates] = useState("");
    const [userGenderValue, setUserGenderValue] = useState();
    const [UserLanguageValue, setUserLanguageValue] = useState([]);
    const [UserCityValue, setUserCityValue] = useState([]);
    // const [allUsers, setAllUsers] = useState([]);
    const [userStateValue, setUserStateValue] = useState([]);
    const [userCategoryValue, setUserCategoryValue] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [languagesList, setLanguagesList] = useState([]);
    const [snackBarMessage, setSnackBarMessage] = useState("submitted successfully");
    const [isActive, setIsActive] = useState(false);
    const [allCities, setAllCities] = useState([]);
    const [allStatesCity, setAllStatesCity] = useState([]);
    const gender = [
        {
            label: "Both",
            value: 2
        },
        {
            label: "Female",
            value: 1
        },
        {
            label: 'Male',
            value: 0
        }
    ];

    const getStates = async () => {
        let response = await CallAPI(endPointName.state, "get");
        let statesCities = response.cityStateModels;
        let onlyStates = response.cityStateModels.filter(el => el.stateId && el.isStateActive == true)
        setAllStatesCity(statesCities);
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
        let temp = cities.map(el => ({ label: el.city, value: el.cityId }))
        setAllCities(temp);
        setCities(temp);
    }

    const getLanguages = async () => {
        let response = await CallAPI(endPointName.Language, "get");
        setLanguagesList(response);
    }

    const getCategory = async () => {
        const categoryResponse = await CallAPI(endPointName.GetWorkExpCategoryMaster, "get");
        setCategoryList(categoryResponse);
    }

    const onSubmitPost = async (param) => {

        if (fromAge <= toAge && toAge >= fromAge) {
            let orgIdFromSession = JSON.parse(sessionStorage.getItem("userJSON"));
            const payload = {
                Param: param,
                PostId: PostId,
                Title: title,
                AgeFrom: fromAge,
                AgeTo: toAge,
                Gender: userGenderValue ? userGenderValue.value : "2",
                States: userStateValue.length == 0 ? "0" : userStateValue.map(el => el.value),
                Cities: UserCityValue.length == 0 ? "0" : UserCityValue.map(el => el.cityId),
                Description: description,
                PublishOn: moment(publishOn).format("YYYY-MM-DD"),
                ValidTill: moment(validTill).format("YYYY-MM-DD"),
                organizationId: orgIdFromSession.organizationId,
                Languages: UserLanguageValue.map(el => el.languageId),
                Categories: userCategoryValue.map(el => el.workExpCategoryId)
            }
            const AddEditPostResponse = await CallAPI(endPointName.AddEditPost, "post", payload);
            if (AddEditPostResponse) {
                setSnackOpen(true);
                setTitle("");
                setDescription('');
                setAgeFrom('');
                setToAge("");
                setUserStateValue([]);
                setUserCategoryValue([]);
                setUserCityValue([]);
                setUserGenderValue();
                setUserLanguageValue([]);
                setPublishOn(null);
                setvalidTill(null);
            } else {
                setSnackBarMessage("Server Error");
            }
        } else {
            setSnackBarMessage("Enter Valid Age");
            setSnackOpen(true);
        }
    }

    useEffect(() => {
        getStates();
        getCities();
        getLanguages();
        getCategory();
    }, []);

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    return (
        <div style={{ margin: 30 }}>
            <Stack spacing={3}>
                <SimpleCard>
                    <ValidatorForm onSubmit={() => onSubmitPost("Insert")} onError={() => null} >
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <TextField
                                    label="Title*"
                                    value={title}
                                    onChange={(event) =>
                                        setTitle(event.target.value)
                                    }
                                    // style={{ marginBottom: 16 }}
                                    fullWidth
                                    validators={["required"]}
                                    errorMessages={["Title is required"]}
                                />
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
                                            fullWidth
                                        />
                                    )}
                                    value={userStateValue}
                                    // style={{ marginBottom: 16 }}
                                    onChange={(_, newValue) => {
                                        setUserStateValue(newValue);
                                        if (newValue.length == 0) {
                                            setCities(allCities)
                                        } else {
                                            let cityFilter = allStatesCity.filter((el) => el.stateId == newValue[newValue.length - 1].value);
                                            let temp = cityFilter.map(el => ({ label: el.city, value: el.cityId }))
                                            if (newValue.length == 1) {
                                                setCities(temp);
                                            } else {
                                                setCities([...cities, temp]);
                                            }
                                        }
                                    }}
                                />
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
                                            fullWidth
                                        />
                                    )}
                                    // style={{ marginBottom: 16 }}
                                    value={UserLanguageValue}
                                    onChange={(_, newValue) => {
                                        setUserLanguageValue(newValue);
                                    }}
                                />
                                <Stack spacing={2} direction="row">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Publish On*"
                                            value={publishOn}
                                            onChange={(newValue) => {
                                                if (newValue) {
                                                    if (newValue.$d == "Invalid Date") {
                                                        setvalidTill(null);
                                                    }
                                                    setPublishOn(newValue.$d);
                                                }
                                            }}
                                            inputFormat="DD-MM-YYYY"
                                            renderInput={(params) =>
                                                <TextField {...params}
                                                    value={publishOn}
                                                    validators={["required"]}
                                                    errorMessages={["Publish On is required"]}
                                                />}
                                        />
                                        <DatePicker
                                            label="Valid Till*"
                                            value={validTill}
                                            onChange={(newValue) => {
                                                if (newValue) {
                                                    setvalidTill(newValue.$d);
                                                }
                                            }}
                                            renderInput={(params) =>
                                                <TextField {...params}
                                                    value={validTill}
                                                    validators={["required"]}
                                                    errorMessages={["Valid Till is required"]}
                                                />}
                                            minDate={publishOn}
                                            inputFormat="DD-MM-YYYY"
                                            disabled={publishOn == "Invalid Date" ? true : false}
                                        />

                                    </LocalizationProvider>
                                </Stack>

                                <div style={{ paddingTop: 16 }}>
                                    <Button color="primary" variant="contained" type="submit">
                                        <Icon>send</Icon>
                                        <Span sx={{ pl: 1, textTransform: "capitalize" }}>Submit</Span>
                                    </Button>
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <Stack spacing={2} direction="row" >
                                    <TextField
                                        label="From Age*"
                                        value={fromAge}
                                        onChange={(event) => setAgeFrom(event.target.value)}
                                        multiline
                                        validators={["required"]}
                                        errorMessages={["From Age is required"]}
                                    />
                                    <p style={{ paddingTop: 15 }}>To</p>
                                    <TextField
                                        label="To Age*"
                                        value={toAge}
                                        onChange={(event) => setToAge(event.target.value)}
                                        validators={["required"]}
                                        errorMessages={["To Age is required"]}
                                    />
                                </Stack>
                                <Autocomplete
                                    multiple
                                    id="tags-outlined"
                                    options={userStateValue.length == 0 ? allCities : cities}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Select City"
                                            fullWidth
                                        />
                                    )}
                                    value={UserCityValue}
                                    // style={{ marginTop: 16, marginBottom: 16 }}
                                    onChange={(_, newValue) => {
                                        setUserCityValue(newValue);
                                    }}
                                />
                                <Autocomplete
                                    multiple
                                    id="tags-outlined"
                                    options={categoryList}
                                    getOptionLabel={(option) => option.workExpCategoryName}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Select Category"
                                            fullWidth
                                        />
                                    )}
                                    // style={{ marginBottom: 16 }}
                                    value={userCategoryValue}
                                    onChange={(_, newValue) => {
                                        setUserCategoryValue(newValue);
                                    }}
                                />
                                {PostId != 0 &&
                                    <FormGroup>
                                        <FormControlLabel control={
                                            <Checkbox
                                                checked={isActive}
                                                defaultChecked
                                            />
                                        }
                                            label="Active" />
                                    </FormGroup>
                                }
                            </Grid>
                            <Grid item xs={4}>
                                <Autocomplete
                                    // multiple
                                    // id="tags-outlined"
                                    options={gender}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Select Gender*"
                                            value={userGenderValue}
                                            fullWidth
                                        // validators={["required"]}
                                        // errorMessages={["Gender is required"]}
                                        />
                                    )}
                                    defaultValue={gender[0]}
                                    value={userGenderValue}
                                    // style={{ marginBottom: 16 }}
                                    onChange={(_, newValue) => {
                                        setUserGenderValue(newValue);
                                    }}
                                />
                                <TextField
                                    label="Description"
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                    // style={{ marginBottom: 16 }}
                                    multiline
                                    minRows={4.5}
                                    maxRows={8}
                                />
                            </Grid>

                            {/* <Grid item xs={4}>
                            <Autocomplete
                                multiple
                                id="tags-outlined"
                                // options={languagesList}
                                options={[]}
                                // getOptionLabel={(option) => option.languageName}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Religion"
                                        fullWidth
                                    />
                                )}
                                style={{ marginBottom: 16 }}
                                value={UserLanguageValue}
                                onChange={(_, newValue) => {
                                    setUserLanguageValue(newValue);
                                }}
                            />
                            <Autocomplete
                                multiple
                                id="tags-outlined"
                                // options={languagesList}
                                options={[]}
                                // getOptionLabel={(option) => option.languageName}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="NRI"
                                        fullWidth
                                    />
                                )}
                                style={{ marginBottom: 16 }}
                            // value={UserLanguageValue}
                            // onChange={(_, newValue) => {
                            //     setUserLanguageValue(newValue);
                            // }}
                            />
                        </Grid> */}
                            {/* <Grid item xs={4} >
                            <Autocomplete
                                multiple
                                id="tags-outlined"
                                // options={languagesList}
                                options={[]}
                                // getOptionLabel={(option) => option.languageName}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Certifications"
                                        fullWidth
                                    />
                                )}
                                style={{ marginBottom: 16 }}
                            // value={UserLanguageValue}
                            // onChange={(_, newValue) => {
                            //     setUserLanguageValue(newValue);
                            // }}
                            />
                            <Stack spacing={2} direction="row">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Publish On"
                                        value={publishOn}
                                        onChange={(newValue) => {
                                            setPublishOn(newValue.$d);
                                        }}
                                        renderInput={(params) => <TextField
                                        />}
                                    />
                                    <DatePicker
                                        label="Valid Till"
                                        value={validTill}
                                        onChange={(newValue) => {
                                            setvalidTill(newValue.$d);
                                        }}
                                        renderInput={(params) =>
                                            <TextField {...params}
                                            />}
                                    />

                                </LocalizationProvider>
                            </Stack>
                        </Grid> */}
                            {/* <Grid item xs={4}> */}
                            {/* {PostId != 0 &&
                                <FormGroup>
                                    <FormControlLabel control={
                                        <Checkbox
                                            checked={isActive}
                                            defaultChecked
                                        />
                                    }
                                        label="Active" />
                                </FormGroup>
                            }
                            <Stack spacing={2} direction="row" style={{ paddingTop: 8 }}>
                                <Button variant="contained"
                                    onClick={() => onSubmitPost("insert")}
                                >
                                    {PostId == 0 ? "Submit" : "Update"}
                                </Button> */}
                            {/* <Button variant="outlined"
                                // onClick={onSubmitPost}
                                >Cancel</Button> */}
                            {/* </Stack> */}
                            {/* </Grid> */}
                        </Grid>

                    </ValidatorForm>
                </SimpleCard>
            </Stack>
            {/* } */}
            <Snackbar
                open={snackOpen}
                onClose={() => setSnackOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                ContentProps={{ "aria-describedby": "message-id" }}
            >
                <Alert onClose={() => setSnackOpen(false)} variant="filled" severity="error" sx={{ width: '100%' }}>
                    {snackBarMessage}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default CreatePost;