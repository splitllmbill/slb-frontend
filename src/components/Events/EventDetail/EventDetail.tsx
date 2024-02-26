import { FC, useEffect, useState } from "react";
import { EventDetailWrapper } from "./EventDetail.styled";
import dataService from "../../../services/DataService";
import { Button, List, Typography } from "@mui/material";
import ExpenseCard from "../../Expenses/ExpenseCard/ExpenseCard";
import { Col, Row } from 'react-bootstrap';
import CloseIcon from '@mui/icons-material/Close';
import CreateExpenseDrawer from "../../Expenses/CreateExpense/CreateExpense";

interface EventDetailProps {
  drawerRef :React.RefObject<any>;
  eventID: string; // Adjust the type as per your EventObject structure
  handleClickEventCard:(eventID:string)=>void
  users:User[]
 }


 

const EventDetail: FC<EventDetailProps> = ({ drawerRef,eventID,handleClickEventCard,users }) => {
  const [event, setEvent] = useState<EventObject>({
    id: '',
    users: [],
    eventName: '',
    totalExpense: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: '',
    updatedBy: '',
    expenses: [],
    dues: {}
  });
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isCreateExpenseOpen, setIsCreateExpenseOpen] = useState(false);
  const toggleCreateExpenseButton = () => {
    setIsCreateExpenseOpen(false);
  };
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
  },[isCreateExpenseOpen]);// Initial data fetch
  
  return (
    <EventDetailWrapper>
    { !isCreateExpenseOpen?
      <div ref={drawerRef}>
      <Row className="d-flex justify-content-end align-items-center text-end">
        <CloseIcon onClick={()=>{handleClickEventCard("")}} style={{paddingTop:'0px', fontSize: '70px',fill: 'white',paddingBottom:'0px' }}/>
      </Row>
      <Row>
        <Typography variant="h2" sx={{ fontWeight:'bold',textTransform: 'capitalize'}}>
          {event.eventName}
        </Typography>
      </Row>
      <Row className="d-flex justify-content-between align-items-center text-end">
        <Col sm={4} className="text-start">
          <Button variant="contained" onClick={()=>setIsCreateExpenseOpen(true)}>Create new expense</Button>
        </Col>
        {/* This empty column acts as a spacer; adjust sm value to control the space */}
        <Col sm={2}></Col>
        <Col sm={6} className="text-end">
          <Typography variant="h5" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
            Total Expense: Rs. {expenses.reduce((a, v) => a = a + v.amount, 0)}
          </Typography>
        </Col>
      </Row>
      
      <List>
      {expenses.map((expense)=>
        <div onClick={()=>{}}>
          <ExpenseCard expense={expense}></ExpenseCard>
      </div>
      )}
      </List>
      
    </div>
    :<CreateExpenseDrawer toggleCreateExpenseButton={toggleCreateExpenseButton} event={event} users={users}></CreateExpenseDrawer>}
  </EventDetailWrapper>);
}

export default EventDetail;