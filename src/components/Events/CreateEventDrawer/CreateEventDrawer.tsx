import { FC, useEffect, useState } from "react";
import { CreateEventWrapper, Flex } from "./CreateEventDrawer.styled";
import apiService from '../../../services/DataService';
import { Autocomplete, Button, Checkbox, Stack, TextField, ThemeProvider } from "@mui/material";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import './CreateEventDrawer.styles.css';

const CreateEventDrawer = () => {
    const [eventName, setEventName] = useState('')
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])
    const [users, setUsers] = useState<User[]>([])

    const fetchData = async () => {
        try {
            await apiService.getFriendsList()
                .then(data => {
                    console.log(data);
                    setUsers(data.friendsList)
                });
        } catch (error) {
            console.log("Error occurred");
        }
    }

    useEffect(() => {
        fetchData()
    }, [setUsers]);// Initial data fetch


    const handleCreateEvent = async () => {
        const createEventObject = {
            eventName: eventName,
            users: [`${localStorage.getItem('userId')}`, ...(selectedUsers.map(selectedUser => selectedUser.friendId!))],
        }
        try {
            const result = await apiService.createEvent(createEventObject as unknown as EventObject)
            if (result) {
                setEventName('');
                navigate(`/event/${result.id}`);
            }
        } catch (error) {
            // setAlertInfo({ open: true, severity: 'error', message: 'Unexpected error occured! Please try again.' });
            console.error('Unexpected error event creation:', error);

        }
    };

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1); 
    };

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;
    return (

        <CreateEventWrapper >
            <Flex>
                <button onClick={handleGoBack}>
                    <IoMdArrowBack style={{ fontSize: 'x-large' }}></IoMdArrowBack> Go Back
                </button>
            </Flex>
            <br />
            {/* <Row className="d-flex justify-content-end align-items-center text-end">
                <CloseIcon onClick={toggleCreateEventButton} style={{ paddingTop: '0px', fontSize: '50px', fill: 'white', paddingBottom: '0px' }} />
            </Row> */}
            <div>
                <Stack spacing={2} useFlexGap direction="column">
                    <h3>Add a New Event</h3>

                    <TextField type="name" placeholder="Event Name" onChange={(event) => setEventName(event.target.value)} value={eventName} name="name" required />
                    <Autocomplete
                        classes={{ endAdornment: 'MuiAutocomplete-endAdornment' }}
                        multiple
                        id="tags-outlined"
                        options={users}
                        onChange={(_, value) => setSelectedUsers(value)}
                        getOptionLabel={(option) => option.name}
                        defaultValue={[]}
                        disableCloseOnSelect
                        limitTags={4}
                        isOptionEqualToValue={(option, value) => option.friendId === value.friendId}
                        renderOption={(props, option, { selected }) => (
                            <li {...props}>
                                <Checkbox
                                    icon={icon}
                                    checkedIcon={checkedIcon}
                                    style={{ marginRight: 8 }}
                                    checked={selected}
                                />
                                {option.name}
                            </li>
                        )}
                        renderInput={(params) => (
                            <TextField {...params} placeholder="Add Users" />
                        )}
                    />


                </Stack>
                <br />
                <Button variant="contained" onClick={handleCreateEvent}>Add</Button>
            </div>
        </CreateEventWrapper>


    );
}

export default CreateEventDrawer;