import { FC } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Col, Row } from 'react-bootstrap';
import { ExpenseCardWrapper, MarginLeft } from './ExpenseCardNew.styled';
import { MdOutlineEventNote } from "react-icons/md";
import { toTitleCase } from '../../../services/State';
import { useNavigate } from 'react-router-dom';

interface ExpenseCardNewProps {
    expense: any; // Adjust the type as per your EventObject structure
}

const ExpenseCardNew: FC<ExpenseCardNewProps> = ({ expense }) => {

    function formatDate(dateString: string) {
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options).replace(/(\d+)(th|st|nd|rd)/, '$1');
    }
    
    const isMobile = window.innerWidth <= 650;

    //exiting path name
    const navigate = useNavigate();
    const handleClick = () => {
        const queryParams = new URLSearchParams(location.search);
       navigate(`/expense/${expense.expenseId}?${queryParams.toString()}`);
    };

    return (
        <ExpenseCardWrapper onClick={handleClick}>
            <Card>
                <CardContent>
                    <Row>
                        {!isMobile && (
                            <>
                                <Col xs={2} md={2} className=" d-sm-block  justify-content-center align-items-center">
                                    <div>{formatDate(expense.expenseDate)}</div>
                                </Col>
                                <Col xs={2} md={2} className=" d-sm-block  justify-content-center align-items-center">
                                    <MdOutlineEventNote style={{ fontSize: 'xx-large' }}></MdOutlineEventNote>
                                </Col>
                            </>)}
                        {isMobile && (
                            <>
                                <Col xs={3} md={3} className=" d-sm-block  justify-content-center align-items-center">
                                    <MdOutlineEventNote style={{ fontSize: 'x-large' }}></MdOutlineEventNote>
                                    <div>{formatDate(expense.expenseDate)}</div>
                                </Col>
                            </>)}
                        <Col className="d-flex ">
                            <MarginLeft className="text-left"> {/* Add text-left class for left alignment inside the div */}
                                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                                    {toTitleCase(expense.expenseName)}
                                </Typography>
                                {!isMobile && <p>Category: {toTitleCase(expense.category)}</p>}
                                {isMobile && <p>{toTitleCase(expense.category)}</p>}
                            </MarginLeft>
                        </Col>
                        <Col className="d-flex justify-content-end">
                            {expense?.user_summary.oweAmount != '0.0' && <Typography variant="body1" color="#785A53" sx={{ fontWeight: 'bold', textTransform: 'capitalize', textAlign: 'right' }}>
                                {expense.user_summary.owePerson === 'user' ? (
                                    <div> You borrowed </div>
                                ) : (
                                    <div>You lent </div>
                                )}
                                <div>Rs.{expense?.user_summary?.oweAmount} <br/> <small>{expense.user_summary.owePerson === 'user'?"from "+ expense.paidBy:""}</small></div>
                                {expense.user_summary.owePerson === 'user' && <div></div>}
                            </Typography>}
                            {expense?.oweAmount == '0.0' && <Typography variant="body1" color="#785A53" sx={{ fontWeight: 'bold', textTransform: 'capitalize', textAlign: 'right' }}>
                                <div> Settled </div>
                            </Typography>}
                        </Col>
                    </Row>
                </CardContent>
            </Card>
        </ExpenseCardWrapper>
    );
};

export default ExpenseCardNew;
