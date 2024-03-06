import { FC, useEffect, createRef, useState } from 'react';
import { EventsWrapper, NoExpensesWrapper } from './Events.styled';
import { MdOutlineGroupAdd } from "react-icons/md";
import EventCard from './EventCard/EventCard';
import dataService from '../../services/DataService';
import { List } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import { TbFaceIdError } from "react-icons/tb";


interface EventsProps {
  currentEventID: string,
}

const Events: FC<EventsProps> = () => {
  const [events, setEvents] = useState<EventsObject>();
  const [showEvents, setShowEvents] = useState(false);

  const fetchData = async () => {
    try {
      await dataService.getUserEvents()
        .then(data => {
          setEvents(data);
          setShowEvents(true);
        });

    } catch (error) {
      console.log("Error occurred");
    }
  }

  useEffect(() => {
    fetchData();
  }, [setEvents]);// Initial data fetch

  const navigate = useNavigate();
  const handleCreateEvent = () => {
    navigate(`/createEvent`);
  };

  return (
    <EventsWrapper>
      <>
        <button onClick={handleCreateEvent}>Create Event <MdOutlineGroupAdd style={{ fontSize: 'x-large' }}></MdOutlineGroupAdd></button>
        {!showEvents && (<div className="d-flex justify-content-center align-items-center"><CircularProgress color="secondary" variant="indeterminate" /></div>)}
        {showEvents && events && events?.events.length > 0 && (
          <>
            <h2>Totally, you owe ${events?.overallYouOwe}</h2>
            <br></br>
            <List>
              {events?.events?.map((event) => (
                <div key={event.id}>
                  <EventCard eventSent={event}></EventCard>
                </div>
              ))}
            </List>
          </>)}
        {showEvents && events && events?.events.length == 0 && (
          <NoExpensesWrapper>
            <TbFaceIdError style={{ fontSize: 'xx-large' }}></TbFaceIdError>
            <h6>No events yet!</h6>
          </NoExpensesWrapper>)}
      </>
    </EventsWrapper>
  );
};

export default Events;
