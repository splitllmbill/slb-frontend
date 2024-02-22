import { FC, useEffect, createRef, useState } from 'react';
import { EventsWrapper } from './Events.styled';
import { MdOutlineGroupAdd } from "react-icons/md";
import EventCard from './EventCard/EventCard';
import dataService from '../../services/DataService';
import { List } from '@mui/material';
import CreateEventDrawer from './CreateEventDrawer/CreateEventDrawer';
import EventDetail from './EventDetail/EventDetail';

interface EventsProps { }

const Events: FC<EventsProps> = () => {
  const [events, setEvents] = useState<EventObject[]>([]);
  const [eventID,setEventID] = useState<string>('');
  const [isEventDrawerOpen,setIsEventDrawerOpen] = useState(false);
  const [isCreateEventDrawerOpen,setIsCreateEventDrawerOpen] = useState(false);
  const createEventDrawerRef:any = createRef();
  
  const handleClickEventCard = (eventID:string) => {
    setEventID(eventID);setIsEventDrawerOpen(true)
  };
  const handleCreateEventButton = () => {
    setIsCreateEventDrawerOpen(true);
  };

  const fetchData = ()=>{
    try {
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

  useEffect(() => {
    const handler = (e:any)=>{
        if (!createEventDrawerRef.current.contains(e.target)){
          setIsCreateEventDrawerOpen(false);
        }
    };
    document.addEventListener("mousedown",handler);
    return()=>{
      document.removeEventListener("mousedown",handler);
    }
  }, [createEventDrawerRef]);
  if(eventID == ''){
    console.log(eventID)
  }
  return (
   <EventsWrapper>
      <button onClick={handleCreateEventButton}>Create Event <MdOutlineGroupAdd style={{ fontSize: 'x-large' }}></MdOutlineGroupAdd></button>
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
      <CreateEventDrawer drawerRef={createEventDrawerRef} setIsOpen={ setIsCreateEventDrawerOpen}></CreateEventDrawer>}
      {
        isEventDrawerOpen && <EventDetail eventID={eventID}/>
      }
    </EventsWrapper>
  );
};

export default Events;
