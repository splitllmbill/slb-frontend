import { FC, useEffect, useState } from "react";
import { EventDetailWrapper } from "./EventDetail.styled";
import dataService from "../../../services/DataService";
import { List, Typography } from "@mui/material";
import ExpenseCard from "../../Expenses/ExpenseCard/ExpenseCard";
import { Row } from 'react-bootstrap';

interface EventDetailProps {
    eventID: string; // Adjust the type as per your EventObject structure
 }

 

const EventDetail: FC<EventDetailProps> = ({ eventID }) => {
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
    
  </EventDetailWrapper>);
}

export default EventDetail;