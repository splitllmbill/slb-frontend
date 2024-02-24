import { FC, useEffect, useState } from "react";
import { EventDetailWrapper } from "./EventDetail.styled";
import dataService from "../../../services/DataService";
import { List, Typography } from "@mui/material";
import ExpenseCard from "../../Expenses/ExpenseCard/ExpenseCard";
import { Row } from 'react-bootstrap';
import CloseIcon from '@mui/icons-material/Close';

interface EventDetailProps {
  drawerRef :React.RefObject<any>;
  eventID: string; // Adjust the type as per your EventObject structure
  handleClickEventCard:(eventID:string)=>void
 }


 

const EventDetail: FC<EventDetailProps> = ({ drawerRef,eventID,handleClickEventCard }) => {
  const [event, setEvent] = useState({eventName:''});
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const fetchData=()=>{
    dataService.getEvent(eventID)
    .then(data => setEvent(data));
    dataService.getEventExpenses(eventID)
    .then(data => setExpenses(data))
  }
  useEffect(() => {
    try {
        fetchData();
      } catch (error) {
        console.log("Error occurred");
      }
  },[]);// Initial data fetch
  
  return (<EventDetailWrapper>
    <div ref={drawerRef}>
      <Row className="d-flex justify-content-end align-items-center text-end">
        <CloseIcon onClick={()=>{handleClickEventCard("")}} style={{paddingTop:'0px', fontSize: '70px',fill: 'white',paddingBottom:'0px' }}/>
      </Row>
      <Row>
        <Typography variant="h2" sx={{ fontWeight:'bold',textTransform: 'capitalize'}}>
          {event.eventName}
        </Typography>
      </Row>
      <Row className="d-flex justify-content-end align-items-center text-end">
        <Typography variant="h5" sx={{ fontWeight:'bold',textTransform: 'capitalize'}}>
          Total Expense: Rs. {expenses.reduce((a,v) =>  a = a + v.amount , 0 )} 
        </Typography> 
      </Row>
      
      <List>
      {expenses.map((expense)=>
        <div onClick={()=>{}}>
          <ExpenseCard expense={expense}></ExpenseCard>
      </div>
      )}
      </List>
      
    </div>
    
  </EventDetailWrapper>);
}

export default EventDetail;