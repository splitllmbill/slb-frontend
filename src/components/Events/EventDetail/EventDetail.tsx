import { FC, useEffect, useState } from "react";
import { NoExpensesWrapper } from "./EventDetail.styled";
import dataService from "../../../services/DataService";
import { List, Typography } from "@mui/material";
import { Col, Row } from 'react-bootstrap';
import { MdOutlineDelete, MdOutlinePlaylistAdd, MdBorderColor } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { FiCornerDownRight } from "react-icons/fi";
import ExpenseCardNew from "../../Expenses/ExpenseCardNew/ExpenseCardNew";
import { TbFaceIdError } from "react-icons/tb";
import { DashboardContainer } from "../../../App.styled";

interface Expense {
  amount: number;
  paidBy: string;
  id: string;
}

const EventDetail: FC = () => {
  const [event, setEvent] = useState<{ eventName: string; expenses: Expense[]; }>({ eventName: "", expenses: [] });
  const [summary, setSummary] = useState<{
    userName:string;
    inDebtTo: { id:string;name: string; amount: number }[];
    isOwed: {id:string; name: string; amount: number }[];
    totalDebt: number;
    totalOwed: number;
  }>({userName:"", inDebtTo: [], isOwed: [], totalDebt: 0, totalOwed: 0 });

  const { eventId } = useParams<{ eventId: string }>();

  const fetchData = () => {
    if (eventId) {
      dataService.getUserSummaryForEvent(eventId).then(summary => setSummary(summary))
      dataService.getEventExpenses(eventId).then(data => {
        setEvent(data);
      })
        .catch(error => {
          console.error("Error fetching event expenses:", error);
        });
    } else {
      alert("Invalid event ID!")
    }
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
  const handleEditEvent = () => {
    navigate(`/event/${eventId}/edit`);
  };

  const handleDeleteEvent = async () => {
    if (eventId) {
      await dataService.deleteEvent(eventId).then((data) => {
        alert(data.message)
        if (data.success == 'true') navigate(-2);
      });
    } else {
      alert("Invalid event ID!")
    }
  }

  const handleSettleUp = async () => {
    
    const shares = summary.inDebtTo.map(creditorDetail => ({
      userId: creditorDetail.id,
      amount: creditorDetail.amount,
    }));
    const createExpenseObject = {
      expenseName: summary.userName + " Settled Up!",
      amount: summary.totalDebt,
      type: "settle",
      paidBy: localStorage.getItem("userId"),
      eventId: eventId,
      category: "settle",
      shares:shares,
      date:  new Date().toDateString()
    };

    try {
      const result = await dataService.createExpense(createExpenseObject as unknown as globalThis.Expense);
      if (result) {
        navigate(`/expense/${result.id}`)
      }
    } catch (error) {
        console.error('Unexpected error expense creation:', error);
    }
  }

  const isMobile = window.innerWidth <= 500;

  return (
    <DashboardContainer>
      <Row>
        <Col xs={3} md={3}>
          <button onClick={handleGoBack} className="w-100">
            <IoMdArrowBack style={{ fontSize: 'x-large' }} />
            {!isMobile && (<span> Go Back</span>)}
          </button>
        </Col>
        <Col xs={3} md={3}>
          <button className="w-100" onClick={handleEditEvent}>
            < MdBorderColor style={{ fontSize: 'x-large' }} />
            {!isMobile && (<span> Edit Event</span>)}
          </button>
        </Col>
        <Col xs={3} md={3}>
          <button className="w-100" onClick={handleCreateExpense}>
            <MdOutlinePlaylistAdd style={{ fontSize: 'x-large' }} />
            {!isMobile && (<span> Add Expense</span>)}
          </button>
        </Col>
        <Col xs={3} md={3}>
          <button className="w-100" onClick={handleDeleteEvent}>  
            <MdOutlineDelete style={{ fontSize: 'x-large' }} />
            {!isMobile && (<span> Delete Event</span>)}
          </button>
        </Col>
      </Row>
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
          <Row className="align-items-center"> {/* This ensures that all items in the row align vertically in the center */}
            <Col xs={3} md={9} className="d-flex align-items-center"> {/* This makes sure the column itself is a flex container, aligning items vertically */}
              {(summary.totalDebt > summary.totalOwed) && 
                <h5>Overall, you owe {summary.totalDebt - summary.totalOwed}</h5>}
              {(summary.totalDebt < summary.totalOwed) &&
                <h5>Overall, you are owed {summary.totalOwed - summary.totalDebt}</h5>}
                
            </Col>

             { (summary.totalOwed!=0) &&
            <Col xs={3} md={3} className="d-flex align-items-center">
              <Row className="align-items-center">
                { (summary.totalOwed!=0) &&( <div> You have unsetlled dues...
                  <button className="w-100" onClick={handleSettleUp}>
                      {!isMobile && (<span>Settle Up!</span>)}
                    </button> </div>)}
              </Row>
            </Col>}
          </Row>
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
    </DashboardContainer >
  );
}

export default EventDetail;
