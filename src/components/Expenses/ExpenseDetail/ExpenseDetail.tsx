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
import { DashboardContainer } from "../../../App.styled";

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
        category: ""
    });
    const [showDetails, setShowDetails] = useState<boolean>(false);
    const queryParams = new URLSearchParams(location.search);
    const { expenseId } = useParams<{ expenseId: string }>();

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
                alert(data.message)
                if (data.success == 'true') {
                    navigate(-2);
                }
            });
        } else {
            alert("Invalid expense ID!")
        }
    }

    const handleEditExpense = async () => {
      
        navigate(`/expense/${expense.id}/edit?${queryParams.toString()}`);
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
                    <Row>
                        <Col xs={3} md={3}>
                            <button onClick={handleGoBack} className="w-100">
                                <IoMdArrowBack style={{ fontSize: 'x-large' }} />
                                {!isMobile && (<span> Go Back</span>)}
                            </button>
                        </Col>
                        <Col xs={3} md={3}></Col>
                        <Col xs={3} md={3}>
                            <button onClick={handleEditExpense} className="w-100">
                                <BiEditAlt style={{ fontSize: 'x-large' }} />
                                {!isMobile && (<span> Edit</span>)}
                            </button>
                        </Col>
                        <Col xs={3} md={3}>
                            <button className="w-100" onClick={handleDeleteExpense}>
                                <MdOutlineDelete style={{ fontSize: 'x-large' }} />
                                {!isMobile && (<span> Delete</span>)}
                            </button>
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
                                    <span><strong>Category:</strong> {expense.category}</span><br />
                                    <span><strong>Amount:</strong> Rs.{expense.amount}</span>
                                    <Small> Created by {expense.createdBy} on {formatDate(expense.createdAt)}</Small>
                                    <Small> Updated by {expense.updatedBy} on {formatDate(expense.updatedAt)}</Small>
                                    <br></br>
                                    <MdOutlineArrowForwardIos></MdOutlineArrowForwardIos><span><strong> {toTitleCase(expense.paidBy)} paid Rs.{expense.amount}</strong></span>
                                    <br></br>
                                    <UL>
                                        {expense.shares.map((share) => (
                                            <li>
                                                <span>
                                                    {share.name === 'you' && expense.paidBy !== 'you' ? 'You owe ' : ''}
                                                    {share.name === 'you' && expense.paidBy === 'you' ? 'You paid ' : ''}
                                                    {share.name && share.name !== 'you' ? `${toTitleCase(share.name)} owes ` : ''}
                                                    Rs.{share.amount}
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
