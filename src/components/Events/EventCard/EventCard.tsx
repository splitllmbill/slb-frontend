import { FC, useEffect, useState } from 'react';
import { EventCardWrapper } from './EventCard.styled';
import { Card, CardContent, Typography } from '@mui/material';
import { toTitleCase } from '../../../services/State';
import dataService from '../../../services/DataService';
import { Col, Row } from 'react-bootstrap';
import group from '../../../assets/group.png';

interface EventCardProps {
   eventSent: EventObject; // Adjust the type as per your EventObject structure
}

const EventCard: FC<EventCardProps> = ({ eventSent }) => {
   const [eventData, setEventData] = useState<any>();

   useEffect(() => {
      const fetchEvents = async () => {
         try {
            const data = await dataService.getDuesForUser(eventSent.id);
            setEventData(data);
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
               <Row>
                  <Col sm={4} className="d-flex  justify-content-center align-items-center">
                     <img src={group}></img>
                  </Col>
                  <Col sm={6} className="d-flex justify-content-center align-items-center">
                     <div className="text-left"> {/* Add text-left class for left alignment inside the div */}
                        <Typography variant="h5" component="div">
                           {toTitleCase(eventSent.eventName)}
                        </Typography>
                        {eventData?.totalOwed > 0 && (
                           <>
                              <Typography variant="h6" color="text.secondary">
                                 You are owed {eventData.totalOwed}
                              </Typography>
                              <Typography variant="body1" color="text.secondary" component="div">
                                 <ul>
                                    {eventData?.isOwed?.map((item: any) => (
                                       <li key={item.id}>
                                          <strong>{item.name} owes you {item.amount}</strong>
                                       </li>
                                    ))}
                                 </ul>
                              </Typography>
                           </>
                        )}
                        {eventData?.totalDebt > 0 && (
                           <>
                              <Typography variant="h6" color="text.secondary">
                                 You owe {eventData.totalDebt}
                              </Typography>
                              <Typography variant="body1" color="text.secondary" component="div">
                                 <ul>
                                    {eventData?.inDebtTo?.map((item: any) => (
                                       <li key={item.id}>
                                          <strong>You owe {item.name} {item.amount}</strong>
                                       </li>
                                    ))}
                                 </ul>
                              </Typography>
                           </>
                        )}
                     </div>
                  </Col>

               </Row>
            </CardContent>
         </Card>
      </EventCardWrapper>
   );
};

export default EventCard;
