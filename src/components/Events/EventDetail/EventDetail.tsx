import { FC, useEffect, useState } from "react";
import { NoExpensesWrapper } from "./EventDetail.styled";
import dataService from "../../../services/DataService";
import { CircularProgress, List, Typography } from "@mui/material";
import { Col, Row } from 'react-bootstrap';
import { MdOutlineDelete, MdOutlinePlaylistAdd, MdBorderColor } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { FiCornerDownRight } from "react-icons/fi";
import ExpenseCardNew from "../../Expenses/ExpenseCardNew/ExpenseCardNew";
import { TbFaceIdError } from "react-icons/tb";
import { DashboardContainer } from "../../../App.styled";
import Pagination from '@mui/material/Pagination';
import SettleExpenseModal from "../../Expenses/SettleExpenseModal/SettleExpenseModal";
import CustomSnackbar from '../../Common/SnackBar/SnackBar';
import ConfirmSnackbar from "../../Common/SnackBar/ConfirmSnackBar";

interface Expense {
  amount: number;
  paidBy: string;
  id: string;
  type: string;
}

const EventDetail: FC = () => {
  const [event, setEvent] = useState<{ eventName: string; expenses: Expense[]; }>({ eventName: "", expenses: [] });
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [summary, setSummary] = useState<{
    userName: string;
    inDebtTo: { id: string; name: string; amount: number }[];
    isOwed: { id: string; name: string; amount: number }[];
    totalDebt: number;
    totalOwed: number;
  }>({ userName: "", inDebtTo: [], isOwed: [], totalDebt: 0, totalOwed: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Change this according to your preference
  const [isModalOpen, setisModalOpen] = useState(false);
  const [snackBarState, setSnackBarState] = useState<{ open: boolean, message: string }>({ open: false, message: "" });
  const { eventId } = useParams<{ eventId: string }>();
  const [modalInput, setModalInput] = useState<{ id: string; name: string; due: number }[]>([]);
  const [confirmSnackBarState, setConfirmSnackBarState] = useState<{ open: boolean, message: string }>({ open: false, message: "" });
  const [confirmation, setConfirmation] = useState<boolean>(false);


  const fetchData = () => {
    if (eventId) {
      dataService.getUserSummaryForEvent(eventId).then(summary => setSummary(summary))
      dataService.getEventExpenses(eventId).then(data => {
        setEvent(data);
        setShowLoader(false);
      })
        .catch(error => {
          console.error("Error fetching event expenses:", error);
          setShowLoader(false);
        });
    } else {
      setSnackBarState({ message: "Invalid event ID!", open: true });
    }
  }

  const handleClose = () => {
    setSnackBarState({ ...snackBarState, open: false });
  };

  useEffect(() => {
    const input = summary.inDebtTo.map((data) => { return { id: data.id, name: data.name, due: data.amount } })
    setModalInput(input);
  }, [summary]);
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
        setSnackBarState({ message: data.message, open: true });
        if (data.success == 'true') navigate(-2);
      });
    } else {
      setSnackBarState({ message: "Invalid event ID!", open: true });
    }
  }

  const handleSettleUp = async (shares: { userId: string, amount: number }[]) => {
    setisModalOpen(false);
    setConfirmSnackBarState({ message: "", open: false });
    setConfirmation(false);
    const createExpenseObject = {
      expenseName: summary.userName + " Settled Up!",
      amount: shares[0].amount,
      type: "settle",
      paidBy: localStorage.getItem("userId"),
      eventId: eventId,
      category: "settle",
      shares: shares,
      date: new Date().toDateString()
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

  const isMobile = window.innerWidth <= 650;

  const handleChangePage = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleConfirmClose = () => {
    setConfirmation(false);
    setConfirmSnackBarState({ ...snackBarState, open: false });
    setisModalOpen(false);
  };

  const handleSetConfirmation = () => {
    setConfirmation(true);
    setConfirmSnackBarState({ ...snackBarState, open: false });
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentExpenses = event.expenses.slice(indexOfFirstItem, indexOfLastItem);

  const totalExpense = event.expenses.reduce((total, expense) => {
    if (expense.type !== "settle") {
      return total + expense.amount;
    }
    return total;
  }, 0);

  return (
    <DashboardContainer>
      <CustomSnackbar message={snackBarState.message} handleClose={handleClose} open={snackBarState.open} />
      <ConfirmSnackbar open={confirmSnackBarState.open} message={confirmSnackBarState.message} handleSetConfirmation={handleSetConfirmation} handleClose={handleConfirmClose} />
      {isModalOpen && <SettleExpenseModal
        onClose={() => setisModalOpen(false)}
        eventSettleUp={handleSettleUp}
        friendData={modalInput}
        settleType='event'
        confirmation={confirmation}
        setConfirmSnackBarState={setConfirmSnackBarState}
      />}
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
      {showLoader && (<div className="d-flex justify-content-center align-items-center"><CircularProgress color="secondary" variant="indeterminate" /></div>)}
      {!showLoader && (
        <div>
          <Row>
            <Col xs={12} sm={6}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                {event.eventName}
              </Typography>
            </Col>
            <Col xs={12} sm={6} className="text-sm-end">
              <Typography variant="h5" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                Total Expense: Rs. {totalExpense}
              </Typography>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <Row className="align-items-center"> {/* This ensures that all items in the row align vertically in the center */}
                <Col xs={6} md={9} className="d-flex align-items-center"> {/* This makes sure the column itself is a flex container, aligning items vertically */}
                  {(summary.totalDebt > summary.totalOwed) &&
                    <h5>Overall, you owe Rs.{summary.totalDebt - summary.totalOwed}</h5>}
                  {(summary.totalDebt < summary.totalOwed) &&
                    <h5>Overall, you are owed Rs.{summary.totalOwed - summary.totalDebt}</h5>}
                </Col>

                {(summary.totalDebt != 0) &&
                  <Col xs={6} md={3} className="d-flex align-items-center">
                    <Row className="align-items-center">
                      {(summary.totalDebt != 0) && (<div> You have dues...
                        <button className="w-100" onClick={() => setisModalOpen(true)}>
                          {!isMobile && (<span>Settle Up!</span>)}
                        </button> </div>)}
                    </Row>
                  </Col>}

              </Row>
              {summary.isOwed.map(item => (
                <>
                  <FiCornerDownRight style={{ fontSize: 'x-large' }}></FiCornerDownRight> <span>{item.name} owes you Rs.{item.amount}</span><br/>
                </>
              ))}
              {summary.inDebtTo.map(item => (
                <>
                  <FiCornerDownRight style={{ fontSize: 'x-large' }}></FiCornerDownRight> <span>You owe {item.name} Rs.{item.amount}</span><br/>
                </>
              ))}
            </Col>
          </Row>
          <br />
          <List>
            {currentExpenses.map((expense) =>
              <div key={expense.id}>
                <ExpenseCardNew expense={expense}></ExpenseCardNew>
              </div>
            )}
            {event.expenses.length == 0 && (
              <NoExpensesWrapper>
                <TbFaceIdError style={{ fontSize: 'xx-large' }}></TbFaceIdError>
                <h6>No expenses yet!</h6>
              </NoExpensesWrapper>)}
          </List>
          <Pagination count={Math.ceil(event.expenses.length / itemsPerPage)} page={currentPage} onChange={handleChangePage} />
        </div>
      )}
    </DashboardContainer >
  );
}

export default EventDetail;
