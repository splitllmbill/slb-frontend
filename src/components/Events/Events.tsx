import { FC, useEffect, createRef, useState } from 'react';
import { EventsWrapper } from './Events.styled';
import { MdOutlineGroupAdd } from "react-icons/md";
import EventCard from './EventCard/EventCard';
import dataService from '../../services/DataService';
import { List } from '@mui/material';
import CreateEventDrawer from './CreateEventDrawer/CreateEventDrawer';

interface EventsProps { }

const Events: FC<EventsProps> = () => {
  const [events, setEvents] = useState<EventObject[]>([]);
  const [isDrawerOpen,setIsDrawerOpen] = useState(false);
  const createEventDrawerRef:any = createRef();
  
  const handleCreateEvent = () => {
    setIsDrawerOpen(true);
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
    if (!isDrawerOpen) 
      fetchData();
  },[setEvents,isDrawerOpen]);// Initial data fetch

  useEffect(() => {
    const handler = (e:any)=>{
        if (!createEventDrawerRef.current.contains(e.target)){
          setIsDrawerOpen(false);
        }
    };
    document.addEventListener("mousedown",handler);
    return()=>{
      document.removeEventListener("mousedown",handler);
    }
  }, [createEventDrawerRef]);

  return (
    <EventsWrapper>
      <button onClick={handleCreateEvent}>Create Event <MdOutlineGroupAdd style={{ fontSize: 'x-large' }}></MdOutlineGroupAdd></button>
      <h2>Totally, you owe _____</h2>
      <br></br>
      <List>
        {events.map((event) => (
          <EventCard eventSent={event}></EventCard>
        ))}
      </List>
      {isDrawerOpen &&
      <CreateEventDrawer drawerRef={createEventDrawerRef} setIsOpen={ setIsDrawerOpen}></CreateEventDrawer>}

    </EventsWrapper>
  );
};

export default Events;
