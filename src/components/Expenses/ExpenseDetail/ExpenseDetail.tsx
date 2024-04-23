import { FC, useEffect, useState } from "react";
import dataService from "../../../services/DataService";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { Small, UL } from "./ExpenseDetails.styled";
import { MdOutlineDelete } from "react-icons/md";
import { Col, Row } from "react-bootstrap";
import { BiEditAlt } from "react-icons/bi";
import { TbListDetails } from "react-icons/tb";
import { Card, CardContent } from "@mui/material";
import { formatDate, toTitleCase } from "../../../services/State";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { Button, DashboardContainer } from "../../../App.styled";
import CustomSnackbar from "../../Common/SnackBar/SnackBar";

const ExpenseDetail: FC = () => {
    const [expense, setExpense] = useState<Expense>({
        date: "",
        expenseName: "",
        amount: 0,
        type: "",
        paidBy: "",
        shares: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "",
        updatedBy: "",
        category: "",
        eventId: '',
        eventName: "None"
    });
    const [showDetails, setShowDetails] = useState<boolean>(false);
    const queryParams = new URLSearchParams(location.search);
    const { expenseId } = useParams<{ expenseId: string }>();
    const [snackBarState, setSnackBarState] = useState<{ open: boolean, message: string }>({ open: false, message: "" });

    const handleClose = () => {
        setSnackBarState({ ...snackBarState, open: false });
    };

    const fetchData = () => {
        if (expenseId) {
            dataService.getExpenseById(expenseId)
                .then(expense => {
                    setExpense(expense)
                    setShowDetails(true)
                })
                .catch(error => {
                    console.error("Error fetching event expenses:", error);
                });
        }
    }

    const handleDeleteExpense = async () => {
        if (expenseId) {
            await dataService.deleteExpense(expenseId).then((data) => {
                setSnackBarState({ message: data.message, open: true });
                if (data.success == 'true') {
                    navigate(-1); 
                }
            });
        } else {
            setSnackBarState({ message: "Invalid expense ID!", open: true });
        }
    }

    const handleEditExpense = async () => {
        navigate(`/expense/${expense.id}/edit?${queryParams.toString()}`);
    }

    const handleEventClick = async () => {
        navigate(`/event/${expense.eventId}`);
    }

    useEffect(() => {
        fetchData();
    }, [expenseId]); // Fetch data when eventId changes

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1);
    };

    const isMobile = window.innerWidth <= 650;

    return (
        <>
            {showDetails && (
                <DashboardContainer>
                    <CustomSnackbar message={snackBarState.message} handleClose={handleClose} open={snackBarState.open} />
                    <Row>
                        <Col xs={3} md={3}>
                            <Button onClick={handleGoBack} className="w-100">
                                <IoMdArrowBack style={{ fontSize: 'x-large' }} />
                                {!isMobile && (<span> Go Back</span>)}
                            </Button>
                        </Col>
                        <Col xs={3} md={3}></Col>
                        <Col xs={3} md={3}>
                            <Button onClick={handleEditExpense} className="w-100">
                                <BiEditAlt style={{ fontSize: 'x-large' }} />
                                {!isMobile && (<span> Edit</span>)}
                            </Button>
                        </Col>
                        <Col xs={3} md={3}>
                            <Button className="w-100" onClick={handleDeleteExpense}>
                                <MdOutlineDelete style={{ fontSize: 'x-large' }} />
                                {!isMobile && (<span> Delete</span>)}
                            </Button>
                        </Col>
                    </Row>
                    <Card>
                        <CardContent>
                            <Row>
                                <Col xs={2} md={2}>
                                    <TbListDetails style={isMobile ? { fontSize: 'xx-large' } : { fontSize: 'xxx-large' }}></TbListDetails>
                                </Col>
                                <Col>
                                    <h4> {expense.expenseName}</h4>
                                    {expense.eventName && expense.eventName != 'None' && (<><span> <a href="" onClick={handleEventClick}><strong>Event: {expense.eventName}</strong></a></span><br /></>)}
                                    < span > <strong>Category:</strong> {expense.category}</span><br />
                                    <span><strong>Amount:</strong> Rs.{expense.amount.toFixed(2)}</span>
                                    <Small> Created by {expense.createdBy} on {formatDate(expense.createdAt)}</Small>
                                    <Small> Updated by {expense.updatedBy} on {formatDate(expense.updatedAt)}</Small>
                                    <br></br>
                                    <MdOutlineArrowForwardIos></MdOutlineArrowForwardIos><span><strong> {toTitleCase(expense.paidBy)} paid Rs.{expense.amount.toFixed(2)}</strong></span>
                                    <br></br>
                                    <UL>
                                        {expense.shares.map((share) => (
                                            <li>
                                                <span>
                                                    {share.name === 'you' && expense.paidBy !== 'you' ? 'You owe ' : ''}
                                                    {share.name === 'you' && expense.paidBy === 'you' ? 'You paid ' : ''}
                                                    {share.name && share.name !== 'you' ? `${toTitleCase(share.name)} owes ` : ''}
                                                    Rs.{share.amount.toFixed(2)}
                                                </span>
                                            </li>
                                        ))}
                                    </UL>
                                </Col>
                            </Row>
                        </CardContent>
                    </Card>

                </DashboardContainer >)
            }
        </>
    );
}

export default ExpenseDetail;
