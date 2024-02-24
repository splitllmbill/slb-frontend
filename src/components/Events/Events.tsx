import { FC, useEffect, createRef, useState } from 'react';
import { EventsWrapper } from './Events.styled';
import { MdOutlineGroupAdd } from "react-icons/md";
import EventCard from './EventCard/EventCard';
import dataService from '../../services/DataService';
import { List} from '@mui/material';
import CreateEventDrawer from './CreateEventDrawer/CreateEventDrawer';
import EventDetail from './EventDetail/EventDetail';

interface EventsProps { }

const Events: FC<EventsProps> = () => {
  const [events, setEvents] = useState<EventObject[]>([]);
  const [eventID,setEventID] = useState<string>('');
  const [users,setUsers] = useState<User[]>([])
  const [isEventDrawerOpen,setIsEventDrawerOpen] = useState(false);
  const [isCreateEventDrawerOpen,setIsCreateEventDrawerOpen] = useState(false);
  const eventDetailRef:any = createRef();
  
  const handleClickEventCard = (eventID:string) => {
    if(eventID !=""){
      setEventID(eventID);setIsEventDrawerOpen(true)
    }else{
      setEventID('');setIsEventDrawerOpen(false)
    }
  };
  const toggleCreateEventButton = () => {
    setIsCreateEventDrawerOpen(!true);
  };

  const fetchData = ()=>{
    try {
      dataService.getAllUsers()
      .then(data => setUsers(data));
      dataService.getUserEvents()
      .then(data => setEvents(data));
    } catch (error) {
      console.log("Error occurred");
    }
  }

  useEffect(() => {
    if (!isCreateEventDrawerOpen) 
      fetchData();
  },[setEvents,isCreateEventDrawerOpen]);// Initial data fetch


  return (
   <EventsWrapper>
      <button onClick={()=>setIsCreateEventDrawerOpen(true)}>Create Event <MdOutlineGroupAdd style={{ fontSize: 'x-large' }}></MdOutlineGroupAdd></button>
      <h2>Totally, you owe _____</h2>
      <br></br>
      <List>
        {events.map((event) => (
          <div onClick={()=>{handleClickEventCard(event.id!)}}>
            <EventCard eventSent={event}></EventCard>
          </div>
         
        ))}
      </List>
      {isCreateEventDrawerOpen &&
      <CreateEventDrawer toggleCreateEventButton={ toggleCreateEventButton} users={users}></CreateEventDrawer>}
      {
        isEventDrawerOpen && <EventDetail drawerRef={eventDetailRef}eventID={eventID}  handleClickEventCard={handleClickEventCard}/>
      }
    </EventsWrapper>
  );
};

export default Events;
