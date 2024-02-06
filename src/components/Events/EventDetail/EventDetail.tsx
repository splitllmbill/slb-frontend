import { FC, useEffect, useState } from "react";
import { EventDetailWrapper } from "./EventDetail.styled";
import dataService from "../../../services/DataService";
import { List } from "@mui/material";
import ExpenseCard from "../../Expenses/ExpenseCard/ExpenseCard";

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
      .then(data => setExpenses(data));
    }
    useEffect(() => {
      try {
          fetchData();
        } catch (error) {
          console.log("Error occurred");
        }
    },[]);// Initial data fetch
  
  return (<EventDetailWrapper>
    <div>
      
    </div>
    <div>
      {event.eventName}
    </div>
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