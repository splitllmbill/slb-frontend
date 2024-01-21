import { FC, useState } from "react";
import { CreateEventWrapper } from "./CreateEventDrawer.styled";
import { Form,FormGroup,Button } from "react-bootstrap";
import apiService from '../../../services/DataService';


interface CreateEventDrawerProps { 
    drawerRef :React.RefObject<any>;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
 const CreateEventDrawer: FC<CreateEventDrawerProps> =({drawerRef,setIsOpen})=>{

    const [eventName,setEventName] = useState('')
    const [users,setUsers] = useState([])
   
    // const [alertInfo, setAlertInfo] = useState({ open: false, severity: 'success', message: '' });

   
    const handleCreateEvent =async ()=>{
        console.log(users);
        const createEventObject={
            eventName:eventName,
            users:[`${localStorage.getItem('userId')}`],
        }
        try {
            const result = await apiService.createEvent(createEventObject as unknown as EventObject)
            if (result) {
                    setEventName('');
                    setUsers([]);
                    setIsOpen(false);
            }
         } catch (error) {
            // setAlertInfo({ open: true, severity: 'error', message: 'Unexpected error occured! Please try again.' });
            console.error('Unexpected error event creation:', error);

         }
    };

    return (
        
        <CreateEventWrapper >
            <div ref={drawerRef}>
                <h3>Add a New Event</h3>
                <br></br>
                <Form >
                    <FormGroup controlId="formBasicName">
                        <Form.Control type="name" placeholder="Event Name" onChange={(event) => setEventName(event.target.value)} value={eventName} name="name" required />
                    </FormGroup>
                    <br></br>
                    <Button variant="primary" type="button" onClick={handleCreateEvent}>
                        Save
                    </Button>
                </Form>
            </div>
            
        </CreateEventWrapper>
    );
}

export default CreateEventDrawer;