import { FC, useEffect, useState } from "react";
import { CreateEventWrapper } from "./CreateEventDrawer.styled";
import apiService from '../../../services/DataService';
import { Autocomplete, Button, Checkbox, Stack, TextField, ThemeProvider, createTheme } from "@mui/material";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";

const CreateEventDrawer: FC<CreateEventDrawerProps> = () => {
    const currentUserId = localStorage.getItem('userId')
    const [eventName, setEventName] = useState('')
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])
    const [users, setUsers] = useState<User[]>([])

    const fetchData = async () => {
        try {
            await apiService.getAllUsers()
                .then(data => {
                    console.log(data);
                    setUsers(data)
                });
        } catch (error) {
            console.log("Error occurred");
        }
    }

    useEffect(() => {
        fetchData()
    }, []);// Initial data fetch


    const handleCreateEvent = async () => {
        const createEventObject = {
            eventName: eventName,
            users: [`${localStorage.getItem('userId')}`, ...(selectedUsers.map(selectedUser => selectedUser.id!))],
        }
        try {
            const result = await apiService.createEvent(createEventObject as unknown as EventObject)
            if (result) {
                setEventName('');
                toggleCreateEventButton();
            }
        } catch (error) {
            // setAlertInfo({ open: true, severity: 'error', message: 'Unexpected error occured! Please try again.' });
            console.error('Unexpected error event creation:', error);

        }
    };

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(`/home`);
    };

    const theme = createTheme({

    });

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;
    return (

        <CreateEventWrapper >
            <button onClick={handleGoBack}>
                <IoMdArrowBack style={{ fontSize: 'x-large' }}></IoMdArrowBack> Go Back
            </button>
            {/* <Row className="d-flex justify-content-end align-items-center text-end">
                <CloseIcon onClick={toggleCreateEventButton} style={{ paddingTop: '0px', fontSize: '50px', fill: 'white', paddingBottom: '0px' }} />
            </Row> */}
            <ThemeProvider theme={theme}>
                <Stack spacing={2} useFlexGap direction="column">
                    <h3>Add a New Event</h3>

                    <TextField type="name" placeholder="Event Name" onChange={(event) => setEventName(event.target.value)} value={eventName} name="name" required />
                    <Autocomplete
                        multiple
                        id="tags-outlined"
                        options={users.filter((user) => user.id != currentUserId)}
                        onChange={(_, value) => setSelectedUsers(value)}
                        getOptionLabel={(option) => option.name}
                        defaultValue={[]}
                        disableCloseOnSelect
                        limitTags={4}
                        // isOptionEqualToValue=
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
            </ThemeProvider>
        </CreateEventWrapper>


    );
}

export default CreateEventDrawer;