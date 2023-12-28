import { FC, useEffect, useState } from 'react';
import { EventsWrapper } from './Events.styled';
import { MdOutlineGroupAdd } from "react-icons/md";
import EventCard from './EventCard/EventCard';
import dataService from '../../services/DataService';
import { List } from '@mui/material';

interface EventsProps { }

const Events: FC<EventsProps> = () => {
  const [events, setEvents] = useState<EventObject[]>([]);
  
  const handleCreateEvent = () => {

  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dataService.getUserEvents();
        setEvents(data);
      } catch (error) {
        console.log("Error occurred");
      }
    };

    fetchData(); // Initial data fetch
  }, []);

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

    </EventsWrapper>
  );
};

export default Events;
