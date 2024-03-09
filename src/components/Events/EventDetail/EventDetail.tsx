import { FC, useEffect, useState } from "react";
import { EventDetailWrapper, Flex, NoExpensesWrapper } from "./EventDetail.styled";
import dataService from "../../../services/DataService";
import { List, Typography } from "@mui/material";
import { Col, Row } from 'react-bootstrap';
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { FiCornerDownRight } from "react-icons/fi";
import ExpenseCardNew from "../../Expenses/ExpenseCardNew/ExpenseCardNew";
import { TbFaceIdError } from "react-icons/tb";

interface Expense {
  id: string;
}

const EventDetail: FC = () => {
  const [event, setEvent] = useState<{
    eventName: string;
    expenses: Expense[];
  }>({
    eventName: "",
    expenses: [],
  });
  const [summary, setSummary] = useState<{
    inDebtTo: [],
    isOwed: [],
    totalDebt: 0,
    totalOwed: 0
  }>({
    inDebtTo: [],
    isOwed: [],
    totalDebt: 0,
    totalOwed: 0
  });

  const { eventId } = useParams<{ eventId: string }>();

  const fetchData = () => {
    dataService.getUserSummaryForEvent(eventId).then(summary => setSummary(summary))
    dataService.getEventExpenses(eventId).then(data => {
      setEvent(data);
    })
      .catch(error => {
        console.error("Error fetching event expenses:", error);
      });
  }

  useEffect(() => {
    fetchData();
  }, [eventId]); // Fetch data when eventId changes

  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1); 
  };
  const handleCreateExpense = () => {
    navigate(`/createExpense/event/${eventId}`);
  };
  

  return (
    <EventDetailWrapper>
      <Flex>
        <button onClick={handleGoBack}>
          <IoMdArrowBack style={{ fontSize: 'x-large' }}></IoMdArrowBack> Go Back
        </button>
        <button onClick={handleCreateExpense}>
          Add Expense <MdOutlinePlaylistAdd style={{ fontSize: 'x-large' }}></MdOutlinePlaylistAdd >
        </button>
      </Flex>
      <br />
      <div>
        <Row>
          <Col xs={12} sm={6}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
              {event.eventName}
            </Typography>
          </Col>
          <Col xs={12} sm={6} className="text-sm-end">
            <Typography variant="h5" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
              Total Expense: Rs. {event.expenses.reduce((a, v) => a + v.amount, 0)}
            </Typography>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            {(summary.totalDebt > summary.totalOwed) && <h5>Overall, you owe {summary.totalDebt - summary.totalOwed}</h5>}
            {(summary.totalDebt < summary.totalOwed) && <h5>Overall, you owe {summary.totalOwed - summary.totalDebt}</h5>}
            {summary.isOwed.map(item => (
              <>
                <FiCornerDownRight style={{ fontSize: 'x-large' }}></FiCornerDownRight> <span>{item.name} owes you Rs.{item.amount}</span>
              </>
            ))}
            {summary.inDebtTo.map(item => (
              <>
                <FiCornerDownRight style={{ fontSize: 'x-large' }}></FiCornerDownRight> <span>You owe {item.name} Rs.{item.amount}</span>
              </>
            ))}
          </Col>
        </Row>
        <br />
        <List>
          {event.expenses.map((expense) =>
            <div key={expense.id} onClick={() => { }}>
              <ExpenseCardNew expense={expense}></ExpenseCardNew>
            </div>
          )}
          {event.expenses.length == 0 && (
            <NoExpensesWrapper>
              <TbFaceIdError style={{ fontSize: 'xx-large' }}></TbFaceIdError>
              <h6>No expenses yet!</h6>
            </NoExpensesWrapper>)}
        </List>
      </div>
    </EventDetailWrapper >
  );
}

export default EventDetail;
