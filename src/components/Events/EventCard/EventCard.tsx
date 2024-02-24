import { FC} from 'react';
import { EventCardWrapper } from './EventCard.styled';
import { Card, CardContent, Typography } from '@mui/material';
import { toTitleCase } from '../../../services/State';
import { Col, Row } from 'react-bootstrap';
import group from '../../../assets/group.png';

interface EventCardProps {
   eventSent: EventObject; // Adjust the type as per your EventObject structure
}

const EventCard: FC<EventCardProps> = ({ eventSent }) => {

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
                        <Typography variant="h5" component="div" sx={{ fontWeight:'bold',textTransform: 'capitalize'}}>
                           {toTitleCase(eventSent.eventName)}
                        </Typography>
                        {eventSent.dues?.totalOwed > 0 && (
                           <>
                              <Typography variant="h6" color="text.secondary">
                                 You are owed {eventSent.dues.totalOwed}
                              </Typography>
                              <Typography variant="body1" color="text.secondary" component="div">
                                 <ul>
                                    {eventSent.dues?.isOwed?.map((item: any) => (
                                       <li key={item.id}>
                                          <strong>{item.name} owes you {item.amount}</strong>
                                       </li>
                                    ))}
                                 </ul>
                              </Typography>
                           </>
                        )}
                        {eventSent.dues?.totalDebt > 0 && (
                           <>
                              <Typography variant="h6" color="text.secondary">
                                 You owe {eventSent.dues.totalDebt}
                              </Typography>
                              <Typography variant="body1" color="text.secondary" component="div">
                                 <ul>
                                    {eventSent.dues?.inDebtTo?.map((item: any) => (
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
