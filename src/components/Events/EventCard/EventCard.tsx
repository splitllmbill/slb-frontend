import React, { FC, useEffect, useState } from 'react';
import { EventCardWrapper } from './EventCard.styled';
import { Card, CardContent, Typography } from '@mui/material';
import { toTitleCase } from '../../../services/State';
import dataService from '../../../services/DataService';

interface EventCardProps {
  eventSent: { eventName: string }; // Adjust the type as per your EventObject structure
}

const EventCard: FC<EventCardProps> = ({ eventSent }) => {
  const [events, setEvents] = useState<EventObject[]>([]);

  useEffect(() => {
    // Function to fetch events from the API
    const fetchEvents = async () => {
      try {
         const data = await dataService.getUserEvents();
         setEvents(data);
       } catch (error) {
         console.log("Error occurred");
       }
    };

    fetchEvents();
  }, []);

  return (
    <EventCardWrapper>
      <Card>
        <CardContent>
          <Typography variant="h5" component="div">
            {toTitleCase(eventSent.eventName)}
          </Typography>
          <Typography color="text.secondary">
            Total Amount Owed: $
          </Typography>

          <Typography variant="body2" color="text.secondary" component="div">
            <h4>Amount Owed to Each Person:</h4>
            <ul>
              {/* Map over the 'events' array instead of 'amountsOwed' */}
              {events.map((event, index) => (
                <li key={index}>
                  {/* Use the appropriate properties of your EventObject */}
                  <strong>{event.person}:</strong> ${event.amount}
                </li>
              ))}
            </ul>
          </Typography>
        </CardContent>
      </Card>
    </EventCardWrapper>
  );
};

export default EventCard;
