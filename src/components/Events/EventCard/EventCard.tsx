import { FC } from 'react';
import { EventCardWrapper } from './EventCard.styled';
import { Card, CardContent, Typography } from '@mui/material';
import { toTitleCase } from '../../../services/State';
import { Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { HiRectangleGroup } from "react-icons/hi2";


interface EventCardProps {
   eventSent: EventObject; // Adjust the type as per your EventObject structure
}

const EventCard: FC<EventCardProps> = ({ eventSent }) => {

   const navigate = useNavigate();
   const handleClick = () => {
      navigate(`/event/${eventSent.id}`);
   };

   return (
      <EventCardWrapper onClick={handleClick}>
         <Card>
            <CardContent>
               <Row>
                  <Col sm={2} xs={3} className="d-flex">
                     <HiRectangleGroup style={{ fontSize: 'xxx-large' }}></HiRectangleGroup>
                  </Col>
                  <Col sm={10} xs={9} className="d-flex align-items-center">
                     <div className="text-left"> {/* Add text-left class for left alignment inside the div */}
                        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                           {toTitleCase(eventSent.eventName)}
                        </Typography>
                        {eventSent.dues?.totalOwed > 0 && (
                           <>
                              <Typography variant="h6" color="text.secondary">
                                 You are owed Rs.{eventSent.dues.totalOwed}
                              </Typography>
                              <Typography variant="body1" color="text.secondary" component="div">
                                 <ul>
                                    {eventSent.dues?.isOwed?.map((item: any, index: number) => (
                                       <li key={index}>
                                          <strong>{item.name} owes you Rs.{item.amount}</strong>
                                       </li>
                                    ))}
                                 </ul>
                              </Typography>
                           </>
                        )}
                        {eventSent.dues?.totalDebt > 0 && (
                           <>
                              <Typography variant="h6" color="text.secondary">
                                 You owe Rs.{eventSent.dues.totalDebt}
                              </Typography>
                              <Typography variant="body1" color="text.secondary" component="div">
                                 <ul>
                                    {eventSent.dues?.inDebtTo?.map((item: any) => (
                                       <li key={item.id}>
                                          <strong>You owe {item.name} Rs.{item.amount}</strong>
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
