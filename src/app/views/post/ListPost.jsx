
import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Icon, IconButton, Stack, styled, TextField } from '@mui/material';
import { Breadcrumb, PostTableLayout, SimpleCard } from 'app/components';
import { CallAPI } from 'apis/callAPI';
import { endPointName } from 'apis/apiList';
import Loading from 'app/components/MatxLoading';
import moment from "moment";
import { useNavigate } from 'react-router-dom';


const Container = styled('div')(({ theme }) => ({
    margin: '30px',
    [theme.breakpoints.down('sm')]: { margin: '16px' },
    '& .breadcrumb': {
        marginBottom: '30px',
        [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
    },
}));

const ListPost = () => {
    const navigate = useNavigate();
    const [allPost, setAllPost] = useState([]);
    const [allPostListData, setAllPostListData] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [openViewModal, setOpenViewModal] = useState(false);
    const [singlePostData, setSinglePostData] = useState()
    const [openUpadteModal, setOpenUpadteModal] = useState(false);


    const columns = [
        {
            id: 'postid',
            name: 'Id',
            // center: true,
            width: '6%',
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
        {
            id: 'age',
            name: 'Age',
            selector: row => row.ageFrom + '-' + row.ageTo,
            // center: true
            width: '7%'
        },
        {
            id: 'gender',
            name: 'Gender',
            selector: row => {
                return row.gender == 0 ? 'Male' : 'Female';
            },
            width: '8%',
            sortable: true
        },
        {
            id: 'description',
            name: 'Description',
            selector: row => row.description,
            wrap: true,
            width: '27%'
        },
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
            width: '10%'
        },
        {
            id: 'validtill',
            name: 'Valid Till',
            selector: row => moment(row.validTill).format('DD MMM YYYY'),
            sortable: true,
            width: '10%'
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
                        <IconButton color="primary" className="button" aria-label="Update" onClick={() => onClickEdit(row)}>
                            <Icon>edit</Icon>
                        </IconButton>
                        {/* <StyledButton style={{ padding: 0 }} variant="outlined" onClick={() => onClickEdit(row)}>Edit</StyledButton> */}
                    </>
                )
            },
            button: true,
            width: '10%'
        }
    ];

    const onClickEdit = (row) => {
        // console.log('Row ==> ', row)
        setSinglePostData(row);
        setOpenUpadteModal(true);
    };

    const onClickView = (row) => {
        setOpenUpadteModal(false);
        // setOpenViewModal(true);
        setSinglePostData(row);
        navigate('/post/DetailPost', { state: { postData: row } });
    }


    const callUserListApi = async () => {
        const payload = {
            OrganizationId: 1
        }
        let response = await CallAPI(endPointName.getAllPostsDetails, "POST", payload);
        setAllPostListData(response);
        setAllPost(response);
    }

    useEffect(() => {
        // apiCallTable();
        callUserListApi();

    }, [])


    const onPressApply = () => {

    }

    const onPressDetails = async () => {

    }

    const onPressReset = () => {

    }

    const searchTextEvent = (event) => {
        setSearchText(event.target.value);
        if (event.target.value.length > 3) {
            const filteredList = allPost.filter(el => {
                const search = new RegExp(event.target.value, 'i');
                const position = el.title.search(search)
                return position > -1
            })
            if (filteredList.length > 0) {
                setAllPost(filteredList)
            }
        } else {
            setAllPost(allPostListData)
        }
    }

    return (
        <Container>
            <Box className="breadcrumb">
                <Breadcrumb routeSegments={[{ name: 'Post' }]} />
            </Box>
            <div style={{ margin: 10 }}>
                {
                    allPost.length == 0 ?
                        <Loading />
                        :

                        <Stack spacing={3}>
                            <SimpleCard>
                                <TextField
                                    // type="text"
                                    label="Search"
                                    value={searchText}
                                    onChange={(event) => searchTextEvent(event)}
                                />
                                <PostTableLayout
                                    columns={columns}
                                    posts={allPost}
                                />
                            </SimpleCard>
                        </Stack>
                }
            </div>
        </Container>
    );
}

export default ListPost;