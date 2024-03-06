import { FC, useEffect, useState } from "react";
import { EventDetailWrapper, Flex } from "./EventDetail.styled";
import dataService from "../../../services/DataService";
import { Button, List, Typography } from "@mui/material";
import ExpenseCard from "../../Expenses/ExpenseCard/ExpenseCard";
import { Col, Row } from 'react-bootstrap';
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { FiCornerDownRight } from "react-icons/fi";

interface Expense {
  id: string;
  // Define other properties of Expense
}

const EventDetail: FC = () => {
  const [event, setEvent] = useState<{
    eventName: string;
    expenses: Expense[];
  }>({
    eventName: "",
    expenses: [],
  });
  const [summary, setSummary] = useState<{}>({});

  const { eventId } = useParams<{ eventId: string }>();

  const fetchData = () => {
    dataService.getEventExpenses(eventId)
      .then(data => {
        setEvent(data);
        dataService.getUserSummaryForEvent(eventId).then(summary => setSummary(summary))
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
    navigate(`/home`);
  };

  return (
    <EventDetailWrapper>
      <Flex>
        <button onClick={handleGoBack}>
          <IoMdArrowBack style={{ fontSize: 'x-large' }}></IoMdArrowBack> Go Back
        </button>
        <button>
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
        <br></br>
        <Row>
          <Col>
            <h6>
              <FiCornerDownRight style={{ fontSize: 'x-large' }}></FiCornerDownRight> You owe ___ ____
            </h6>
            <h6>
              <FiCornerDownRight style={{ fontSize: 'x-large' }}></FiCornerDownRight> You owe ___ ____
            </h6>
          </Col>
        </Row>
        <br />
        <List>
          {event.expenses.map((expense) =>
            <div key={expense.id} onClick={() => { }}>
              <ExpenseCard expense={expense}></ExpenseCard>
            </div>
          )}
        </List>
      </div>
    </EventDetailWrapper>
  );
}

export default EventDetail;
