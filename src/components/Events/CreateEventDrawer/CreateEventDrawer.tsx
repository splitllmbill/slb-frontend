import { FC, useEffect, useState } from "react";
import apiService from '../../../services/DataService';
import { Button, Stack, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import './CreateEventDrawer.styles.css';
import { DashboardContainer, Flex } from "../../../App.styled";
import CustomAutocomplete from "../../Common/CustomAutoComplete/CustomAutoComplete";

interface CreateEventDrawerProps {
    eventID: string;
}

const CreateEventDrawer: FC<CreateEventDrawerProps> = ({ eventID }) => {
    const [eventName, setEventName] = useState('')
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [eventData, setEventData] = useState<Partial<EventObject>>({});
    const [loading, setLoading] = useState(false); // Add loading state

    const fetchData = async () => {
        try {
            if (eventID != "") {
                await apiService.getEvent(eventID)
                    .then(data => {
                        setEventData(data)
                        setEventName(data.eventName!)
                        setSelectedUsers(data.users)
                    });
            }
            await apiService.getFriendsList()
                .then(data => {
                    setUsers(data.friendsList)
                });
        } catch (error) {
            console.log("Error occurred");
        }
    }

    useEffect(() => {
        fetchData()
    }, []);// Initial data fetch

    const handleCreateEvent = async () => {
        setLoading(true);
        const createEventObject = {
            eventName: eventName,
            users: [`${localStorage.getItem('userId')}`, ...(selectedUsers.map(selectedUser => selectedUser.id!))],
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

        } finally {
            setLoading(false); // Reset loading state regardless of success or failure
        }
    };

    const handleEditEvent = async () => {
        setLoading(true);
        const ediEventObject = {
            id: eventID,
            expenses: eventData.expenses,
            eventName: eventName,
            users: [...(selectedUsers.map(selectedUser => selectedUser.id))],
        }
        try {
            const result = await apiService.editEvent(ediEventObject as unknown as EventObject)
            if (result) {
                setEventName('');
                navigate(`/event/${eventID}`);
            }
        } catch (error) {
            // setAlertInfo({ open: true, severity: 'error', message: 'Unexpected error occured! Please try again.' });
            console.error('Unexpected error event creation:', error);

        } finally {
            setLoading(false); // Reset loading state regardless of success or failure
        }
    };

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1);
    };

    return (

        <DashboardContainer >
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
                    <h3>{eventID == "" ? "Add a New Event" : "Edit Event"}</h3>

                    <TextField type="name" placeholder="Event Name" onChange={(event) => setEventName(event.target.value)} value={eventName} name="name" required />
                    <CustomAutocomplete
                        options={users}
                        onChange={(value) => setSelectedUsers(value)}
                        getOptionLabel={(option) => option.name}
                        value={selectedUsers}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                    />


                </Stack>
                <br />
                <Button variant="contained" disabled={loading} onClick={eventID == "" ? handleCreateEvent : handleEditEvent}>{eventID == "" ? "Add" : "Edit"}</Button>
            </div>
        </DashboardContainer>


    );
}

export default CreateEventDrawer;